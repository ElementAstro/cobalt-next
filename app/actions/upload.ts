"use server";

import axios from "axios";

export async function uploadFile(
  formData: FormData,
  signal: AbortSignal,
  onProgress: (progress: number) => void
) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "File upload failed" };
  }
}
