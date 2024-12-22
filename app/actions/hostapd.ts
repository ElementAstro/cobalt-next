"use server";

import { writeFile } from "fs/promises";
import { HostapdConfig } from "@/types/extra/hostapd";

export async function saveHostapdConfig(config: HostapdConfig) {
  const configContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  try {
    await writeFile("/etc/hostapd/hostapd.conf", configContent);
    return { success: true };
  } catch (error) {
    console.error("Failed to save hostapd configuration:", error);
    return { success: false, error: "Failed to save configuration" };
  }
}
