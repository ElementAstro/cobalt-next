import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { RateLimiter } from "limiter";
import log from "@/utils/logger";

export enum ApiErrorType {
  NetworkError = "NETWORK_ERROR",
  TimeoutError = "TIMEOUT_ERROR",
  ServerError = "SERVER_ERROR",
  ClientError = "CLIENT_ERROR",
  CancelError = "CANCEL_ERROR",
  UnknownError = "UNKNOWN_ERROR",
}

export class ApiError extends Error {
  type: ApiErrorType;
  status?: number;
  code?: string;
  config?: AxiosRequestConfig;
  timestamp: number;

  constructor(
    type: ApiErrorType,
    message: string,
    options?: {
      status?: number;
      code?: string;
      config?: AxiosRequestConfig;
    }
  ) {
    super(message);
    this.type = type;
    this.status = options?.status;
    this.code = options?.code;
    this.config = options?.config;
    this.timestamp = Date.now();
  }
}

export interface ApiConfig extends AxiosRequestConfig {
  useQueue?: boolean;
  rateLimitPerSecond?: number;
  retryConfig?: {
    retries: number;
    delay: number;
    shouldRetry?: (error: any) => boolean;
  };
  cache?: boolean;
  priority?: number;
  timeoutErrorMessage?: string;
  validateStatus?: (status: number) => boolean;
}

class ApiWrapper {
  private api: AxiosInstance;
  private queue: Array<{ request: () => Promise<any>; priority: number }> = [];
  private isProcessingQueue = false;
  private rateLimiter: RateLimiter;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 60000; // 1 minute

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
      return Promise.reject(
        new ApiError(ApiErrorType.CancelError, "Request was canceled", {
          config: (error as any).config,
        })
      );
    }

    if (error.response) {
      const status = error.response.status;
      const errorType =
        status >= 500 ? ApiErrorType.ServerError : ApiErrorType.ClientError;
      const errorMessage =
        error.response.data?.message ||
        `Request failed with status code ${status}`;

      log.error(`[Error] ${status} ${error.response.config.url}`);
      log.error("Response:", error.response.data);

      return Promise.reject(
        new ApiError(errorType, errorMessage, {
          status,
          code: error.code,
          config: error.config,
        })
      );
    }

    if (error.request) {
      log.error("[Error] No response received");
      log.error("Request:", error.request);

      if (error.code === "ECONNABORTED") {
        return Promise.reject(
          new ApiError(
            ApiErrorType.TimeoutError,
            error.config?.timeoutErrorMessage || "Request timed out",
            { config: error.config }
          )
        );
      }

      return Promise.reject(
        new ApiError(
          ApiErrorType.NetworkError,
          "Network error - no response received",
          { config: error.config }
        )
      );
    }

    log.error("[Error]", error.message);
    return Promise.reject(
      new ApiError(
        ApiErrorType.UnknownError,
        error.message || "Unknown error occurred",
        { config: error.config }
      )
    );
  };

  private async processQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;
    while (this.queue.length > 0) {
      this.queue.sort((a, b) => b.priority - a.priority); // Sort by priority
      const { request } = this.queue.shift()!;
      await request();
    }
    this.isProcessingQueue = false;
  }

  public async request<T>(config: ApiConfig): Promise<T> {
    if (config.cache && config.method?.toLowerCase() === "get") {
      const cacheKey = JSON.stringify(config);
      const cachedResponse = this.cache.get(cacheKey);
      if (
        cachedResponse &&
        Date.now() - cachedResponse.timestamp < this.cacheTTL
      ) {
        return cachedResponse.data;
      }
    }

    if (config.useQueue) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          request: async () => {
            try {
              const result = await this.executeRequest<T>(config);
              if (config.cache && config.method?.toLowerCase() === "get") {
                this.cache.set(JSON.stringify(config), {
                  data: result,
                  timestamp: Date.now(),
                });
              }
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          priority: config.priority || 0,
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
