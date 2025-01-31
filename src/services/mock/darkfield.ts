import {
  DarkFieldAPI,
  DarkFieldState,
  DarkFieldProgress,
} from "@/types/guiding/darkfield";

export class MockDarkFieldAPI implements DarkFieldAPI {
  private creationInterval?: NodeJS.Timeout;
  private isPaused: boolean = false;
  private currentProgress: DarkFieldProgress = {
    currentFrame: 0,
    totalFrames: 0,
    currentExposure: 0,
    estimatedTimeLeft: 0,
    currentTemperature: 0,
    stage: "preparing",
    warnings: [],
    performance: {
      frameRate: 0, // 修改为正确的性能指标
      processingTime: 0, // 处理时间
      savingTime: 0, // 保存时间
    },
  };

  async getStatistics(): Promise<DarkFieldState["statistics"]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      totalFrames: 1234,
      averageExposure: 2.5,
      lastCreated: new Date().toISOString(),
      librarySize: 1.2 * 1024 * 1024 * 1024,
      totalTime: 128.5 * 3600,
      avgTemperature: -15.2,
      successRate: 0.985,
      compression: 2.1,
    };
  }

  async getHistory(days: number): Promise<DarkFieldState["history"]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        frames: Math.floor(Math.random() * 100),
        temperature: -15 + Math.random() * 5,
        exposure: 1 + Math.random() * 4,
        successCount: Math.floor(Math.random() * 100),
        totalCount: 100,
      });
    }
    return data;
  }

  async createDarkField(
    config: Parameters<DarkFieldAPI["createDarkField"]>[0]
  ): Promise<void> {
    if (this.creationInterval) {
      throw new Error("Creation already in progress");
    }

    const { minExposure, maxExposure, framesPerExposure } = config;

    this.currentProgress = {
      currentFrame: 0,
      totalFrames: framesPerExposure,
      currentExposure: minExposure,
      estimatedTimeLeft: framesPerExposure * maxExposure,
      currentTemperature: -15,
      stage: "capturing",
      warnings: [],
      performance: {
        frameRate: 30, // 每秒帧数
        processingTime: 100, // 处理时间(毫秒)
        savingTime: 50, // 保存时间(毫秒)
      },
    };

    this.creationInterval = setInterval(() => {
      if (
        !this.isPaused &&
        this.currentProgress.currentFrame < framesPerExposure
      ) {
        this.currentProgress.currentFrame++;
        this.currentProgress.estimatedTimeLeft -= maxExposure;
      }
    }, maxExposure * 1000);

    return Promise.resolve();
  }

  async cancelCreation(): Promise<void> {
    if (this.creationInterval) {
      clearInterval(this.creationInterval);
      this.creationInterval = undefined;
      this.currentProgress = {
        currentFrame: 0,
        totalFrames: 0,
        currentExposure: 0,
        estimatedTimeLeft: 0,
        currentTemperature: 0,
        stage: "preparing",
        warnings: [],
        performance: {
          frameRate: 0,
          processingTime: 0,
          savingTime: 0,
        },
      };
    }
    return Promise.resolve();
  }

  async pauseCreation(): Promise<void> {
    this.isPaused = true;
    return Promise.resolve();
  }

  async resumeCreation(): Promise<void> {
    this.isPaused = false;
    return Promise.resolve();
  }

  async getProgress(): Promise<DarkFieldProgress> {
    return this.currentProgress;
  }

  async validateSettings(settings: Partial<DarkFieldState>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!settings.minExposure || settings.minExposure < 0) {
      errors.push("最小曝光时间必须大于0");
    }

    if (
      !settings.maxExposure ||
      (settings.minExposure !== undefined &&
        settings.maxExposure < settings.minExposure)
    ) {
      errors.push("最大曝光时间必须大于最小曝光时间");
    }

    if (!settings.framesPerExposure || settings.framesPerExposure < 1) {
      errors.push("每次曝光帧数必须大于0");
    }

    if (
      settings.targetTemperature !== undefined &&
      settings.targetTemperature > 0
    ) {
      warnings.push("建议将目标温度设置为负值以减少噪点");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async exportReport(): Promise<Blob> {
    const report = {
      generatedAt: new Date().toISOString(),
      statistics: await this.getStatistics(),
      history: await this.getHistory(30),
    };

    return new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
  }

  async getDiskSpace(): Promise<{
    total: number;
    used: number;
    available: number;
  }> {
    return {
      total: 1000 * 1024 * 1024 * 1024, // 1000 GB
      used: 600 * 1024 * 1024 * 1024, // 600 GB
      available: 400 * 1024 * 1024 * 1024, // 400 GB
    };
  }

  async optimizeLibrary(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return;
  }
}
