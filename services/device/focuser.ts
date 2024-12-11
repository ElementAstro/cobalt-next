import { api } from "@/services/axios";
import { useFocuserStore } from "@/lib/store/device";
import * as yup from "yup";
import logger from "@/lib/logger";

const BASE_URL = "/api/focuser";

// 定义校验模式
const positionSchema = yup.object().shape({
  position: yup.number().required().min(0).max(25000),
});

const stepSizeSchema = yup.object().shape({
  stepSize: yup.number().required().positive(),
});

const temperatureSchema = yup.object().shape({
  temperature: yup.number().required().min(-50).max(50),
});

const backflashSchema = yup.object().shape({
  backflash: yup.number().required().positive(),
});

export const focuserApi = {
  connect: async () => {
    logger.info("Attempting to connect to the focuser...");
    try {
      await api.request({
        url: `${BASE_URL}/connect`,
        method: "POST",
      });
      useFocuserStore.getState().setConnected(true);
      logger.info("Focuser connected successfully.");
    } catch (error) {
      logger.error("Failed to connect to the focuser:", error);
      throw new Error("Failed to connect focuser");
    }
  },

  disconnect: async () => {
    logger.info("Attempting to disconnect the focuser...");
    try {
      await api.request({
        url: `${BASE_URL}/disconnect`,
        method: "POST",
      });
      useFocuserStore.getState().setConnected(false);
      logger.info("Focuser disconnected successfully.");
    } catch (error) {
      logger.error("Failed to disconnect the focuser:", error);
      throw new Error("Failed to disconnect focuser");
    }
  },

  setPosition: async (position: number) => {
    logger.info(`Setting focuser position to ${position}...`);
    try {
      await positionSchema.validate({ position });
      await api.request({
        url: `${BASE_URL}/position`,
        method: "POST",
        data: { position },
      });
      useFocuserStore.getState().setTargetPosition(position);
      logger.info(`Focuser position set to ${position}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set focuser position:", error);
      throw new Error("Failed to set focuser position");
    }
  },

  setStepSize: async (stepSize: number) => {
    logger.info(`Setting focuser step size to ${stepSize}...`);
    try {
      await stepSizeSchema.validate({ stepSize });
      await api.request({
        url: `${BASE_URL}/stepSize`,
        method: "POST",
        data: { stepSize },
      });
      useFocuserStore.getState().setStepSize(stepSize);
      logger.info(`Focuser step size set to ${stepSize}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set focuser step size:", error);
      throw new Error("Failed to set focuser step size");
    }
  },

  setTemperature: async (temperature: number) => {
    logger.info(`Setting focuser temperature to ${temperature}...`);
    try {
      await temperatureSchema.validate({ temperature });
      await api.request({
        url: `${BASE_URL}/temperature`,
        method: "POST",
        data: { temperature },
      });
      useFocuserStore.getState().setTemperature(temperature);
      logger.info(`Focuser temperature set to ${temperature}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set focuser temperature:", error);
      throw new Error("Failed to set focuser temperature");
    }
  },

  setBackflash: async (backflash: number) => {
    logger.info(`Setting focuser backflash to ${backflash}...`);
    try {
      await backflashSchema.validate({ backflash });
      await api.request({
        url: `${BASE_URL}/backflash`,
        method: "POST",
        data: { backflash },
      });
      useFocuserStore.getState().setBackflash(backflash);
      logger.info(`Focuser backflash set to ${backflash}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set focuser backflash:", error);
      throw new Error("Failed to set focuser backflash");
    }
  },

  moveFocuser: async (steps: number) => {
    logger.info(`Moving focuser by ${steps} steps...`);
    try {
      await api.request({
        url: `${BASE_URL}/move`,
        method: "POST",
        data: { steps },
      });
      useFocuserStore.getState().moveFocuser(steps);
      logger.info(`Focuser moved by ${steps} steps.`);
    } catch (error) {
      logger.error("Failed to move focuser:", error);
      throw new Error("Failed to move focuser");
    }
  },
};
