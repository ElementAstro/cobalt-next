import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { RateLimiter } from "limiter";
import log from "@/utils/logger";

interface ApiConfig extends AxiosRequestConfig {
  useQueue?: boolean;
  rateLimitPerSecond?: number;
  retryConfig?: {
    retries: number;
    delay: number;
    shouldRetry?: (error: any) => boolean;
  };
}

class ApiWrapper {
  private api: AxiosInstance;
  private queue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private rateLimiter: RateLimiter;

  constructor(config: ApiConfig) {
    this.api = axios.create({
      baseURL:
        config.baseURL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.example.com",
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: config.rateLimitPerSecond || 10,
      interval: "second",
    });
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      this.requestInterceptor,
      this.errorInterceptor
    );
    this.api.interceptors.response.use(
      this.responseInterceptor,
      this.errorInterceptor
    );
  }

  private requestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    log.info(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    log.debug("Headers:", config.headers);
    log.debug("Data:", config.data);
    return config;
  };

  private responseInterceptor = (response: AxiosResponse) => {
    log.info(`[Response] ${response.status} ${response.config.url}`);
    log.debug("Data:", response.data);
    return response;
  };

  private errorInterceptor = (error: any) => {
    if (axios.isCancel(error)) {
      log.warn("Request canceled:", error.message);
    } else if (error.response) {
      log.error(
        `[Error] ${error.response.status} ${error.response.config.url}`
      );
      log.error("Response:", error.response.data);
    } else if (error.request) {
      log.error("[Error] No response received");
      log.error("Request:", error.request);
    } else {
      log.error("[Error]", error.message);
    }
    return Promise.reject(error);
  };

  private async processQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
      }
    }
    this.isProcessingQueue = false;
  }

  public async request<T>(config: ApiConfig): Promise<T> {
    if (config.useQueue) {
      return new Promise((resolve, reject) => {
        this.queue.push(async () => {
          try {
            const result = await this.executeRequest<T>(config);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        this.processQueue();
      });
    } else {
      return this.executeRequest<T>(config);
    }
  }

  private async executeRequest<T>(config: ApiConfig): Promise<T> {
    await this.rateLimiter.removeTokens(1);
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error) {
      if ((config.retryConfig?.retries ?? 0) > 0) {
        const shouldRetry = config.retryConfig?.shouldRetry || (() => true);
        if (shouldRetry(error)) {
          await new Promise((resolve) =>
            setTimeout(resolve, config.retryConfig?.delay)
          );
          return this.request<T>({
            ...config,
            retryConfig: {
              delay: config.retryConfig?.delay || 0,
              ...config.retryConfig,
              retries: (config.retryConfig?.retries ?? 1) - 1,
            },
          });
        }
      }
      throw error;
    }
  }

  public createCancelTokenSource = () => axios.CancelToken.source();
}

export const api = new ApiWrapper({
  rateLimitPerSecond: 5,
});

export default api;
