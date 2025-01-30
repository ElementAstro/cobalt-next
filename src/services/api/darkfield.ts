import { DarkFieldAPI, DarkFieldProgress } from "@/types/guiding/darkfield";
import { DarkFieldState } from "@/types/guiding/darkfield";
import api from "@/services/axios";

export class RealDarkFieldAPI implements DarkFieldAPI {
  private baseUrl = "/api/darkfield";

  async getStatistics(): Promise<DarkFieldState["statistics"]> {
    return api.request({
      url: `${this.baseUrl}/statistics`,
      method: "GET",
    });
  }

  async getHistory(days: number): Promise<DarkFieldState["history"]> {
    return api.request({
      url: `${this.baseUrl}/history`,
      method: "GET",
      params: { days },
    });
  }

  async createDarkField(
    config: Parameters<DarkFieldAPI["createDarkField"]>[0]
  ): Promise<void> {
    return api.request({
      url: `${this.baseUrl}/create`,
      method: "POST",
      data: config,
    });
  }

  async cancelCreation(): Promise<void> {
    return api.request({
      url: `${this.baseUrl}/cancel`,
      method: "POST",
    });
  }

  async exportReport(): Promise<Blob> {
    return api.request({
      url: `${this.baseUrl}/export`,
      method: "GET",
      responseType: "blob",
    });
  }

  async getProgress(): Promise<DarkFieldProgress> {
    return api.request({
      url: `${this.baseUrl}/progress`,
      method: "GET",
    });
  }

  async pauseCreation(): Promise<void> {
    return api.request({
      url: `${this.baseUrl}/pause`,
      method: "POST",
    });
  }

  async resumeCreation(): Promise<void> {
    return api.request({
      url: `${this.baseUrl}/resume`,
      method: "POST",
    });
  }

  async validateSettings(settings: Partial<DarkFieldState>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return api.request({
      url: `${this.baseUrl}/validate`,
      method: "POST",
      data: settings,
    });
  }

  async getDiskSpace(): Promise<{
    total: number;
    used: number;
    available: number;
  }> {
    return api.request({
      url: `${this.baseUrl}/disk-space`,
      method: "GET",
    });
  }

  async optimizeLibrary(): Promise<void> {
    return api.request({
      url: `${this.baseUrl}/optimize`,
      method: "POST",
    });
  }
}
