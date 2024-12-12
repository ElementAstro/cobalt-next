import { api } from "../axios";
import { useCameraStore } from "@/lib/store/device";
import { useExposureStore } from "@/lib/store/dashboard";
import logger from "@/lib/logger";
import * as yup from "yup";

const BASE_URL = "/api/camera";

const exposureSchema = yup.object().shape({
  exposure: yup.number().required().positive(),
});

const gainSchema = yup.object().shape({
  gain: yup.number().required().positive().integer().min(0).max(255),
});

const isoSchema = yup.object().shape({
  iso: yup
    .number()
    .required()
    .positive()
    .test(
      "is-divisible-by-50",
      "ISO must be divisible by 50",
      (value) => value % 50 === 0
    ),
});

const offsetSchema = yup.object().shape({
  offset: yup.number().required().positive(),
});

const binningSchema = yup.object().shape({
  binning: yup
    .number()
    .required()
    .positive()
    .integer()
    .oneOf([1, 2, 4, 8], "Binning must be one of 1, 2, 4, or 8"),
});

const temperatureSchema = yup.object().shape({
  temperature: yup.number().required().integer().min(-50).max(50),
});

const powerSchema = yup.object().shape({
  power: yup.number().required().positive().integer().min(0).max(100),
});

const startExposureSchema = yup.object().shape({
  exposure: yup.number().required().positive().min(0.0001).max(3600),
  gain: yup.number().required().positive(),
  binning: yup.number().required().positive().integer().oneOf([1, 2, 4, 8]),
});

// Camera API
export const cameraApi = {
  connect: async () => {
    logger.info("Attempting to connect to the camera...");
    try {
      await api.request({
        url: `${BASE_URL}/connect`,
        method: "POST",
      });
      useCameraStore.getState().setConnected(true);
      logger.info("Camera connected successfully.");
    } catch (error) {
      logger.error("Failed to connect to the camera:", error);
      throw new Error("Failed to connect camera");
    }
  },

  disconnect: async () => {
    logger.info("Attempting to disconnect the camera...");
    try {
      await api.request({
        url: `${BASE_URL}/disconnect`,
        method: "POST",
      });
      useCameraStore.getState().setConnected(false);
      logger.info("Camera disconnected successfully.");
    } catch (error) {
      logger.error("Failed to disconnect the camera:", error);
      throw new Error("Failed to disconnect camera");
    }
  },

  setExposure: async (exposure: number) => {
    logger.info(`Setting exposure to ${exposure}...`);
    try {
      await exposureSchema.validate({ exposure });
      await api.request({
        url: `${BASE_URL}/exposure`,
        method: "POST",
        data: { exposure },
      });
      useCameraStore.getState().setExposure(exposure);
      useExposureStore.getState().setExposureTime(exposure);
      logger.info(`Exposure set to ${exposure}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set exposure:", error);
      throw new Error("Failed to set exposure");
    }
  },

  setGain: async (gain: number) => {
    logger.info(`Setting gain to ${gain}...`);
    try {
      await gainSchema.validate({ gain });
      await api.request({
        url: `${BASE_URL}/gain`,
        method: "POST",
        data: { gain },
      });
      useCameraStore.getState().setGain(gain);
      useExposureStore.getState().setGain(gain);
      logger.info(`Gain set to ${gain}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set gain:", error);
      throw new Error("Failed to set gain");
    }
  },

  setISO: async (iso: number) => {
    logger.info(`Setting ISO to ${iso}...`);
    try {
      await isoSchema.validate({ iso });
      await api.request({
        url: `${BASE_URL}/iso`,
        method: "POST",
        data: { iso },
      });
      useCameraStore.getState().setISO(iso);
      useExposureStore.getState().setISO(iso);
      logger.info(`ISO set to ${iso}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set ISO:", error);
      throw new Error("Failed to set ISO");
    }
  },

  setOffset: async (offset: number) => {
    logger.info(`Setting offset to ${offset}...`);
    try {
      await offsetSchema.validate({ offset });
      await api.request({
        url: `${BASE_URL}/offset`,
        method: "POST",
        data: { offset },
      });
      useCameraStore.getState().setOffset(offset);
      useExposureStore.getState().setOffset(offset);
      logger.info(`Offset set to ${offset}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set offset:", error);
      throw new Error("Failed to set offset");
    }
  },

  setBinning: async (binning: number) => {
    logger.info(`Setting binning to ${binning}...`);
    try {
      await binningSchema.validate({ binning });
      await api.request({
        url: `${BASE_URL}/binning`,
        method: "POST",
        data: { binning },
      });
      useCameraStore.getState().setBinning(binning);
      useExposureStore.getState().setBinning(`${binning}x${binning}`);
      logger.info(`Binning set to ${binning}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set binning:", error);
      throw new Error("Failed to set binning");
    }
  },

  toggleCooler: async () => {
    const { coolerOn } = useCameraStore.getState();
    logger.info(
      `Toggling cooler, current state: ${coolerOn ? "on" : "off"}...`
    );
    try {
      await api.request({
        url: `${BASE_URL}/cooler`,
        method: "POST",
      });
      useCameraStore.getState().toggleCooler();
      logger.info(`Cooler state toggled to: ${!coolerOn ? "on" : "off"}.`);
    } catch (error) {
      logger.error("Failed to toggle cooler:", error);
      throw new Error("Failed to toggle cooler");
    }
  },

  setTargetTemperature: async (temperature: number) => {
    logger.info(`Setting target temperature to ${temperature}...`);
    try {
      await temperatureSchema.validate({ temperature });
      await api.request({
        url: `${BASE_URL}/temperature`,
        method: "POST",
        data: { temperature },
      });
      useCameraStore.getState().setTargetTemperature(temperature);
      logger.info(`Target temperature set to ${temperature}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set target temperature:", error);
      throw new Error("Failed to set target temperature");
    }
  },

  setTargetCoolingPower: async (power: number) => {
    logger.info(`Setting target cooling power to ${power}...`);
    try {
      await powerSchema.validate({ power });
      await api.request({
        url: `${BASE_URL}/power`,
        method: "POST",
        data: { power },
      });
      useCameraStore.getState().setTargetCoolingPower(power);
      logger.info(`Target cooling power set to ${power}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set target cooling power:", error);
      throw new Error("Failed to set target cooling power");
    }
  },

  startExposure: async (exposure: number, gain: number, binning: number) => {
    logger.info(
      `Starting exposure with ${exposure}s, gain ${gain}, binning ${binning}x${binning}...`
    );
    try {
      await startExposureSchema.validate({ exposure, gain, binning });
      await api.request({
        url: `${BASE_URL}/exposure/start`,
        method: "POST",
        data: { exposure, gain, binning },
      });
      logger.info("Exposure started.");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to start exposure:", error);
      throw new Error("Failed to start exposure");
    }
  },

  abortExposure: async () => {
    logger.info("Aborting exposure...");
    try {
      await api.request({
        url: `${BASE_URL}/exposure/abort`,
        method: "POST",
      });
      logger.info("Exposure aborted.");
    } catch (error) {
      logger.error("Failed to abort exposure:", error);
      throw new Error("Failed to abort exposure");
    }
  },
};
