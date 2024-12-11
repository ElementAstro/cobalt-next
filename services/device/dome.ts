import { api } from "@/services/axios";
import { useDomeStore } from "@/lib/store/device";
import * as yup from "yup";
import logger from "@/lib/logger";

const BASE_URL = "/api/dome";

// 定义校验模式
const azimuthSchema = yup.object().shape({
  azimuth: yup.number().required().min(0).max(360),
});

const temperatureSchema = yup.object().shape({
  temperature: yup.number().required().min(-50).max(50),
});

const humiditySchema = yup.object().shape({
  humidity: yup.number().required().min(0).max(100),
});

const pressureSchema = yup.object().shape({
  pressure: yup.number().required().min(300).max(1100),
});

const windSpeedSchema = yup.object().shape({
  windSpeed: yup.number().required().min(0).max(150),
});

const rainStatusSchema = yup.object().shape({
  rainStatus: yup.string().required().oneOf(["none", "drizzle", "rain"]),
});

export const domeApi = {
  connect: async () => {
    logger.info("Attempting to connect to the dome...");
    try {
      await api.request({
        url: `${BASE_URL}/connect`,
        method: "POST",
      });
      useDomeStore.getState().setConnected(true);
      logger.info("Dome connected successfully.");
    } catch (error) {
      logger.error("Failed to connect to the dome:", error);
      throw new Error("Failed to connect dome");
    }
  },

  disconnect: async () => {
    logger.info("Attempting to disconnect the dome...");
    try {
      await api.request({
        url: `${BASE_URL}/disconnect`,
        method: "POST",
      });
      useDomeStore.getState().setConnected(false);
      logger.info("Dome disconnected successfully.");
    } catch (error) {
      logger.error("Failed to disconnect the dome:", error);
      throw new Error("Failed to disconnect dome");
    }
  },

  setAzimuth: async (azimuth: number) => {
    logger.info(`Setting dome azimuth to ${azimuth}...`);
    try {
      await azimuthSchema.validate({ azimuth });
      await api.request({
        url: `${BASE_URL}/azimuth`,
        method: "POST",
        data: { azimuth },
      });
      useDomeStore.getState().setAzimuth(azimuth);
      logger.info(`Dome azimuth set to ${azimuth}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set dome azimuth:", error);
      throw new Error("Failed to set dome azimuth");
    }
  },

  setShutterStatus: async (
    status: "open" | "closed" | "opening" | "closing"
  ) => {
    logger.info(`Setting dome shutter status to ${status}...`);
    try {
      await api.request({
        url: `${BASE_URL}/shutterStatus`,
        method: "POST",
        data: { status },
      });
      useDomeStore.getState().setShutterStatus(status);
      logger.info(`Dome shutter status set to ${status}.`);
    } catch (error) {
      logger.error("Failed to set dome shutter status:", error);
      throw new Error("Failed to set dome shutter status");
    }
  },

  setTemperature: async (temperature: number) => {
    logger.info(`Setting dome temperature to ${temperature}...`);
    try {
      await temperatureSchema.validate({ temperature });
      await api.request({
        url: `${BASE_URL}/temperature`,
        method: "POST",
        data: { temperature },
      });
      useDomeStore.getState().setTemperature(temperature);
      logger.info(`Dome temperature set to ${temperature}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set dome temperature:", error);
      throw new Error("Failed to set dome temperature");
    }
  },

  setHumidity: async (humidity: number) => {
    logger.info(`Setting dome humidity to ${humidity}...`);
    try {
      await humiditySchema.validate({ humidity });
      await api.request({
        url: `${BASE_URL}/humidity`,
        method: "POST",
        data: { humidity },
      });
      useDomeStore.getState().setHumidity(humidity);
      logger.info(`Dome humidity set to ${humidity}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set dome humidity:", error);
      throw new Error("Failed to set dome humidity");
    }
  },

  setPressure: async (pressure: number) => {
    logger.info(`Setting dome pressure to ${pressure}...`);
    try {
      await pressureSchema.validate({ pressure });
      await api.request({
        url: `${BASE_URL}/pressure`,
        method: "POST",
        data: { pressure },
      });
      useDomeStore.getState().setPressure(pressure);
      logger.info(`Dome pressure set to ${pressure}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set dome pressure:", error);
      throw new Error("Failed to set dome pressure");
    }
  },

  setWindSpeed: async (windSpeed: number) => {
    logger.info(`Setting dome wind speed to ${windSpeed}...`);
    try {
      await windSpeedSchema.validate({ windSpeed });
      await api.request({
        url: `${BASE_URL}/windSpeed`,
        method: "POST",
        data: { windSpeed },
      });
      useDomeStore.getState().setWindSpeed(windSpeed);
      logger.info(`Dome wind speed set to ${windSpeed}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set dome wind speed:", error);
      throw new Error("Failed to set dome wind speed");
    }
  },

  setRainStatus: async (status: "none" | "drizzle" | "rain") => {
    logger.info(`Setting dome rain status to ${status}...`);
    try {
      await rainStatusSchema.validate({ rainStatus: status });
      await api.request({
        url: `${BASE_URL}/rainStatus`,
        method: "POST",
        data: { status },
      });
      useDomeStore.getState().setRainStatus(status);
      logger.info(`Dome rain status set to ${status}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set dome rain status:", error);
      throw new Error("Failed to set dome rain status");
    }
  },
};
