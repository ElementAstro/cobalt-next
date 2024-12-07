import { useDomeStore } from "@/lib/store/dome";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDomeApi = {
  connect: async () => {
    await delay(1000);
    useDomeStore.getState().setConnected(true);
  },

  disconnect: async () => {
    await delay(1000);
    useDomeStore.getState().setConnected(false);
  },

  setAzimuth: async (azimuth: number) => {
    await delay(2000);
    useDomeStore.getState().setAzimuth(azimuth);
    useDomeStore.getState().setSlewing(false);
  },

  openShutter: async () => {
    useDomeStore.getState().setShutterStatus("opening");
    await delay(3000);
    useDomeStore.getState().setShutterStatus("open");
  },

  closeShutter: async () => {
    useDomeStore.getState().setShutterStatus("closing");
    await delay(3000);
    useDomeStore.getState().setShutterStatus("closed");
  },

  sync: async () => {
    await delay(1000);
    useDomeStore.getState().setSynced(true);
  },

  findHome: async () => {
    await delay(5000);
    useDomeStore.getState().setAzimuth(0);
  },

  stop: async () => {
    await delay(500);
    useDomeStore.getState().setSlewing(false);
  },

  park: async () => {
    await delay(3000);
    useDomeStore.getState().setAzimuth(180);
  },
};
