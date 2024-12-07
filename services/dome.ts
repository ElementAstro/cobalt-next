import { useDomeStore } from "@/lib/store/dome";

const BASE_URL = "/api/dome";

export const domeApi = {
  connect: async () => {
    const response = await fetch(`${BASE_URL}/connect`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to connect");
    useDomeStore.getState().setConnected(true);
  },

  disconnect: async () => {
    const response = await fetch(`${BASE_URL}/disconnect`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to disconnect");
    useDomeStore.getState().setConnected(false);
  },

  setAzimuth: async (azimuth: number) => {
    const response = await fetch(`${BASE_URL}/azimuth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ azimuth }),
    });
    if (!response.ok) throw new Error("Failed to set azimuth");
    useDomeStore.getState().setAzimuth(azimuth);
  },

  openShutter: async () => {
    const response = await fetch(`${BASE_URL}/shutter/open`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to open shutter");
    useDomeStore.getState().setShutterStatus("opening");
  },

  closeShutter: async () => {
    const response = await fetch(`${BASE_URL}/shutter/close`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to close shutter");
    useDomeStore.getState().setShutterStatus("closing");
  },

  sync: async () => {
    const response = await fetch(`${BASE_URL}/sync`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to sync");
    useDomeStore.getState().setSynced(true);
  },

  findHome: async () => {
    const response = await fetch(`${BASE_URL}/find-home`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to find home");
  },

  stop: async () => {
    const response = await fetch(`${BASE_URL}/stop`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to stop");
    useDomeStore.getState().setSlewing(false);
  },

  park: async () => {
    const response = await fetch(`${BASE_URL}/park`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to park");
  },
};
