// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟数据加载
async function mockLoadData(
  progressCallback: (progress: number) => void
): Promise<void> {
  const totalSteps = 5;
  for (let i = 1; i <= totalSteps; i++) {
    await delay(1000);
    progressCallback((i / totalSteps) * 100);
  }
}

// 真实的 API 调用
async function realLoadData(
  progressCallback: (progress: number) => void
): Promise<void> {
  try {
    const response = await fetch("/api/load-data");
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get("Content-Length") ?? "0");
    let receivedLength = 0;

    while (true) {
      const { done, value } = (await reader?.read()) ?? {
        done: true,
        value: undefined,
      };
      if (done) break;
      receivedLength += value?.length ?? 0;
      progressCallback((receivedLength / contentLength) * 100);
    }
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

export const api = {
  loadData: async (
    progressCallback: (progress: number) => void,
    useMock: boolean = true
  ): Promise<void> => {
    if (useMock) {
      return mockLoadData(progressCallback);
    } else {
      return realLoadData(progressCallback);
    }
  },
};
