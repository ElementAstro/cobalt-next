import { api } from "@/services/axios";
import { useGuiderStore } from "@/lib/store/device/guiding";
import * as yup from "yup";
import logger from "@/lib/logger";

const BASE_URL = "/api/guider";

// 定义校验模式
const exposureTimeSchema = yup.object().shape({
  exposureTime: yup.number().required().positive().min(0.1).max(60),
});

const calibrationStepsSchema = yup.object().shape({
  calibrationSteps: yup
    .number()
    .required()
    .positive()
    .integer()
    .min(1)
    .max(100),
});

const guidingAccuracySchema = yup.object().shape({
  guidingAccuracy: yup.number().required().positive().min(0).max(10),
});

export const guiderApi = {
  connect: async () => {
    logger.info("Attempting to connect to the guider...");
    try {
      await api.request({
        url: `${BASE_URL}/connect`,
        method: "POST",
      });
      useGuiderStore.getState().setConnected(true);
      logger.info("Guider connected successfully.");
    } catch (error) {
      logger.error("Failed to connect to the guider:", error);
      throw new Error("Failed to connect guider");
    }
  },

  disconnect: async () => {
    logger.info("Attempting to disconnect the guider...");
    try {
      await api.request({
        url: `${BASE_URL}/disconnect`,
        method: "POST",
      });
      useGuiderStore.getState().setConnected(false);
      logger.info("Guider disconnected successfully.");
    } catch (error) {
      logger.error("Failed to disconnect the guider:", error);
      throw new Error("Failed to disconnect guider");
    }
  },

  startGuiding: async () => {
    logger.info("Attempting to start guiding...");
    try {
      await api.request({
        url: `${BASE_URL}/start`,
        method: "POST",
      });
      useGuiderStore.getState().startGuiding();
      logger.info("Guiding started successfully.");
    } catch (error) {
      logger.error("Failed to start guiding:", error);
      throw new Error("Failed to start guiding");
    }
  },

  stopGuiding: async () => {
    logger.info("Attempting to stop guiding...");
    try {
      await api.request({
        url: `${BASE_URL}/stop`,
        method: "POST",
      });
      useGuiderStore.getState().stopGuiding();
      logger.info("Guiding stopped successfully.");
    } catch (error) {
      logger.error("Failed to stop guiding:", error);
      throw new Error("Failed to stop guiding");
    }
  },

  setExposureTime: async (exposureTime: number) => {
    logger.info(`Setting exposure time to ${exposureTime} seconds...`);
    try {
      await exposureTimeSchema.validate({ exposureTime });
      await api.request({
        url: `${BASE_URL}/exposureTime`,
        method: "POST",
        data: { exposureTime },
      });
      useGuiderStore.getState().setExposureTime(exposureTime);
      logger.info(`Exposure time set to ${exposureTime} seconds.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set exposure time:", error);
      throw new Error("Failed to set exposure time");
    }
  },

  setCalibrationStatus: async (status: string) => {
    logger.info(`Setting calibration status to ${status}...`);
    try {
      await api.request({
        url: `${BASE_URL}/calibrationStatus`,
        method: "POST",
        data: { status },
      });
      useGuiderStore.getState().setCalibrationStatus(status);
      logger.info(`Calibration status set to ${status}.`);
    } catch (error) {
      logger.error("Failed to set calibration status:", error);
      throw new Error("Failed to set calibration status");
    }
  },

  setGuidingAccuracy: async (accuracy: number) => {
    logger.info(`Setting guiding accuracy to ${accuracy}...`);
    try {
      await guidingAccuracySchema.validate({ accuracy });
      await api.request({
        url: `${BASE_URL}/guidingAccuracy`,
        method: "POST",
        data: { accuracy },
      });
      useGuiderStore.getState().setGuidingAccuracy(accuracy);
      logger.info(`Guiding accuracy set to ${accuracy}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set guiding accuracy:", error);
      throw new Error("Failed to set guiding accuracy");
    }
  },

  dither: async (pixels: number) => {
    logger.info(`Dithering by ${pixels} pixels...`);
    try {
      await api.request({
        url: `${BASE_URL}/dither`,
        method: "POST",
        data: { pixels },
      });
      useGuiderStore.getState().dither(pixels);
      logger.info(`Dithered by ${pixels} pixels.`);
    } catch (error) {
      logger.error("Failed to dither:", error);
      throw new Error("Failed to dither");
    }
  },

  // 新增：获取导星信息实时更新
  subscribeToUpdates: (onUpdate: (data: any) => void) => {
    const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API_HOST}/guider`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
      
      // 更新状态存储
      const store = useGuiderStore.getState();
      if (data.exposureTime !== undefined) {
        store.setExposureTime(data.exposureTime);
      }
      if (data.calibrationStatus !== undefined) {
        store.setCalibrationStatus(data.calibrationStatus);
      }
      if (data.guidingAccuracy !== undefined) {
        store.setGuidingAccuracy(data.guidingAccuracy);
      }
    };

    return () => {
      ws.close();
    };
  },

  // 新增：校准导星
  calibrate: async () => {
    logger.info("Starting guider calibration...");
    try {
      await api.request({
        url: `${BASE_URL}/calibrate`,
        method: "POST",
      });
      useGuiderStore.getState().setCalibrationStatus("Calibrating");
      logger.info("Guider calibration started.");
    } catch (error) {
      logger.error("Failed to start calibration:", error);
      throw new Error("Failed to start calibration");
    }
  },
};
