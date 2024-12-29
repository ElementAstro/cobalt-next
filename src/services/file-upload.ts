import axios from "axios";

export async function uploadFile(
  formData: FormData,
  signal: AbortSignal,
  onProgress: (progress: number) => void
) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("未提供文件");
    }

    const url = "YOUR_UPLOAD_URL"; // 替换为实际的上传URL

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (event.lengthComputable && event.total) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      },
      signal,
    });

    if (response.status >= 200 && response.status < 300) {
      return { success: true, url: response.data.url };
    } else {
      throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }
  } catch (error: any) {
    console.error("上传错误:", error);
    return { success: false, error: error.message || "文件上传失败" };
  }
}
