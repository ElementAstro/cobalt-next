import { api } from "./axios";
import type { ApiConfig } from "./axios";
import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

interface HttpTestClientConfig extends ApiConfig {
  retries?: number;
  retryDelay?: number;
}

interface FormattedResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  config: AxiosRequestConfig;
}

interface FormattedError {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: any;
  config?: AxiosRequestConfig;
  error?: string;
  request?: any;
}

export class HttpTestClient {
  private retryConfig: { retries: number; retryDelay: number };

  constructor(config: HttpTestClientConfig = {}) {
    this.retryConfig = {
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  async request(config: ApiConfig): Promise<FormattedResponse> {
    let retries = this.retryConfig.retries;
    while (retries >= 0) {
      try {
        const response = (await api.request({
          ...config,
          retryConfig: {
            retries: 0, // Disable ApiWrapper's retry since we handle it here
            delay: this.retryConfig.retryDelay,
          },
        })) as AxiosResponse;
        return this.formatResponse(response);
      } catch (error) {
        if (retries === 0) {
          throw this.formatError(error as AxiosError);
        }
        console.log(`Request failed. Retrying... (${retries} attempts left)`);
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryConfig.retryDelay)
        );
        retries--;
      }
    }
    throw new Error("Request failed after all retries");
  }

  private formatResponse(response: AxiosResponse<any, any>): FormattedResponse {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: this.formatHeaders(response.headers),
      data: response.data,
      config: response.config,
    };
  }

  private formatError(error: AxiosError): FormattedError {
    if (error.response) {
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: this.formatHeaders(error.response.headers),
        data: error.response.data,
        config: error.response.config,
      };
    } else if (error.request) {
      return {
        error: "The request was made but no response was received",
        request: error.request,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }

  private formatHeaders(
    headers: Record<string, unknown>
  ): Record<string, string> {
    const formattedHeaders: Record<string, string> = {};
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        formattedHeaders[key] = value;
      }
    });
    return formattedHeaders;
  }
}
