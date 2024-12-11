import { api } from "@/services/axios";
import { useFilterWheelStore } from "@/lib/store/device";
import * as yup from "yup";
import logger from "@/lib/logger";

const BASE_URL = "/api/filterWheel";

const positionSchema = yup.object().shape({
  position: yup.number().required().min(1).max(8),
});

export const filterWheelApi = {
  connect: async () => {
    logger.info("Attempting to connect to the filter wheel...");
    try {
      await api.request({
        url: `${BASE_URL}/connect`,
        method: "POST",
      });
      useFilterWheelStore.getState().setConnected(true);
      logger.info("Filter wheel connected successfully.");
    } catch (error) {
      logger.error("Failed to connect to the filter wheel:", error);
      throw new Error("Failed to connect filter wheel");
    }
  },

  disconnect: async () => {
    logger.info("Attempting to disconnect the filter wheel...");
    try {
      await api.request({
        url: `${BASE_URL}/disconnect`,
        method: "POST",
      });
      useFilterWheelStore.getState().setConnected(false);
      logger.info("Filter wheel disconnected successfully.");
    } catch (error) {
      logger.error("Failed to disconnect the filter wheel:", error);
      throw new Error("Failed to disconnect filter wheel");
    }
  },

  changeFilter: async (position: number) => {
    logger.info(`Changing filter to position ${position}...`);
    try {
      await positionSchema.validate({ position });
      await api.request({
        url: `${BASE_URL}/changeFilter`,
        method: "POST",
        data: { position },
      });
      useFilterWheelStore.getState().setPosition(position);
      useFilterWheelStore
        .getState()
        .setSelectedFilter(
          useFilterWheelStore.getState().filterWheelInfo.filters[position - 1]
        );
      logger.info(`Filter changed to position ${position}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to change filter:", error);
      throw new Error("Failed to change filter");
    }
  },

  setMaxPosition: async (maxPosition: number) => {
    logger.info(`Setting max position to ${maxPosition}...`);
    try {
      await positionSchema.validate({ position: maxPosition });
      useFilterWheelStore.getState().setMaxPosition(maxPosition);
      logger.info(`Max position set to ${maxPosition}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set max position:", error);
      throw new Error("Failed to set max position");
    }
  },

  setMinPosition: async (minPosition: number) => {
    logger.info(`Setting min position to ${minPosition}...`);
    try {
      await positionSchema.validate({ position: minPosition });
      useFilterWheelStore.getState().setMinPosition(minPosition);
      logger.info(`Min position set to ${minPosition}.`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error("Validation failed:", error.message);
        throw new Error("Validation failed: " + error.message);
      }
      logger.error("Failed to set min position:", error);
      throw new Error("Failed to set min position");
    }
  },

  setIsMoving: async (isMoving: boolean) => {
    logger.info(`Setting isMoving to ${isMoving}...`);
    try {
      useFilterWheelStore.getState().setIsMoving(isMoving);
      logger.info(`isMoving set to ${isMoving}.`);
    } catch (error) {
      logger.error("Failed to set isMoving:", error);
      throw new Error("Failed to set isMoving");
    }
  },
};
