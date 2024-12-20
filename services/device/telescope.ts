import { api } from "@/services/axios";
import { useMountStore } from "@/lib/store/device/telescope";
import * as yup from "yup";
import logger from "@/lib/logger";

const BASE_URL = "/api/mount";

// 定义校验模式
const raSchema = yup.object().shape({
  ra: yup.number().required().min(0).max(24),
});

const decSchema = yup.object().shape({
  dec: yup.number().required().min(-90).max(90),
});

const azSchema = yup.object().shape({
  az: yup.number().required().min(0).max(360),
});

const altSchema = yup.object().shape({
  alt: yup.number().required().min(0).max(90),
});

export const mountApi = {
  connect: async () => {
    logger.info("Attempting to connect to the mount...");
    try {
      await api.request({
        url: `${BASE_URL}/connect`,
        method: "POST",
      });
      useMountStore.getState().setIsConnected(true);
      logger.info("Mount connected successfully.");
    } catch (error) {
      logger.error("Failed to connect to the mount:", error);
      throw new Error("Failed to connect mount");
    }
  },

  disconnect: async () => {
    logger.info("Attempting to disconnect the mount...");
    try {
      await api.request({
        url: `${BASE_URL}/disconnect`,
        method: "POST",
      });
      useMountStore.getState().setIsConnected(false);
      logger.info("Mount disconnected successfully.");
    } catch (error) {
      logger.error("Failed to disconnect the mount:", error);
      throw new Error("Failed to disconnect mount");
    }
  },

  togglePark: async () => {
    logger.info("Attempting to toggle park switch...");
    try {
      await api.request({
        url: `${BASE_URL}/park`,
        method: "POST",
      });
      useMountStore.getState().toggleParkSwitch();
      logger.info("Park switch toggled successfully.");
    } catch (error) {
      logger.error("Failed to toggle park switch:", error);
      throw new Error("Failed to toggle park switch");
    }
  },

  toggleHome: async () => {
    logger.info("Attempting to toggle home switch...");
    try {
      await api.request({
        url: `${BASE_URL}/home`,
        method: "POST",
      });
      useMountStore.getState().toggleHomeSwitch();
      logger.info("Home switch toggled successfully.");
    } catch (error) {
      logger.error("Failed to toggle home switch:", error);
      throw new Error("Failed to toggle home switch");
    }
  },

  toggleTrack: async () => {
    logger.info("Attempting to toggle track switch...");
    try {
      await api.request({
        url: `${BASE_URL}/track`,
        method: "POST",
      });
      useMountStore.getState().toggleTrackSwitch();
      logger.info("Track switch toggled successfully.");
    } catch (error) {
      logger.error("Failed to toggle track switch:", error);
      throw new Error("Failed to toggle track switch");
    }
  },

  setCurrentRA: async (ra: number) => {
    logger.info(`Setting current RA to ${ra}...`);
    try {
      await raSchema.validate({ ra });
      await api.request({
        url: `${BASE_URL}/ra`,
        method: "POST",
        data: { ra },
      });
      useMountStore.getState().setCurrentRA(ra);
      logger.info(`Current RA set to ${ra}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set current RA:", error);
      throw new Error("Failed to set current RA");
    }
  },

  setCurrentDec: async (dec: number) => {
    logger.info(`Setting current Dec to ${dec}...`);
    try {
      await decSchema.validate({ dec });
      await api.request({
        url: `${BASE_URL}/dec`,
        method: "POST",
        data: { dec },
      });
      useMountStore.getState().setCurrentDec(dec);
      logger.info(`Current Dec set to ${dec}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set current Dec:", error);
      throw new Error("Failed to set current Dec");
    }
  },

  setCurrentAz: async (az: number) => {
    logger.info(`Setting current Az to ${az}...`);
    try {
      await azSchema.validate({ az });
      await api.request({
        url: `${BASE_URL}/az`,
        method: "POST",
        data: { az },
      });
      useMountStore.getState().setCurrentAz(az);
      logger.info(`Current Az set to ${az}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set current Az:", error);
      throw new Error("Failed to set current Az");
    }
  },

  setCurrentAlt: async (alt: number) => {
    logger.info(`Setting current Alt to ${alt}...`);
    try {
      await altSchema.validate({ alt });
      await api.request({
        url: `${BASE_URL}/alt`,
        method: "POST",
        data: { alt },
      });
      useMountStore.getState().setCurrentAlt(alt);
      logger.info(`Current Alt set to ${alt}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set current Alt:", error);
      throw new Error("Failed to set current Alt");
    }
  },
};
