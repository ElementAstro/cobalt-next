import { useMountStore } from "@/lib/store/device";
import { useCallback } from "react";

export const useMountControl = () => {
  const {
    parkSwitch,
    trackSwitch,
    speedNum,
    speedTotalNum,
    toggleParkSwitch,
    toggleTrackSwitch,
    incrementSpeed,
    decrementSpeed,
    setSpeedTotalNum,
    setIsIdle,
    setIsConnected,
    toggleNightMode,
  } = useMountStore();

  const handleMouseDownRA = useCallback((direction: "plus" | "minus") => {
    const command = direction === "plus" ? "MountMoveNorth" : "MountMoveSouth";
    // 发送命令的逻辑
  }, []);

  const handleMouseDownDEC = useCallback((direction: "plus" | "minus") => {
    const command = direction === "plus" ? "MountMoveWest" : "MountMoveEast";
    // 发送命令的逻辑
  }, []);

  const stop = useCallback(() => {
    // 发送停止命令的逻辑
  }, []);

  const mountPark = useCallback(() => {
    toggleParkSwitch();
    // 发送Park命令的逻辑
  }, [toggleParkSwitch]);

  const mountTrack = useCallback(() => {
    toggleTrackSwitch();
    // 发送Track命令的逻辑
  }, [toggleTrackSwitch]);

  const mountHome = useCallback(() => {
    // 发送Home命令的逻辑
  }, []);

  const mountSync = useCallback(() => {
    // 发送Sync命令的逻辑
  }, []);

  const solveSync = useCallback(() => {
    const focalLength = 510;
    const cameraSizeWidth = 24.9;
    const cameraSizeHeight = 16.6;
    const command = `SolveSYNC:${focalLength}:${cameraSizeWidth}:${cameraSizeHeight}`;
    // 发送SolveSync命令的逻辑
  }, []);

  const mountSlewRateSwitch = useCallback(() => {
    if (speedNum < speedTotalNum.length - 1) {
      incrementSpeed();
    } else {
      decrementSpeed();
    }
    // 发送SlewRateSet命令的逻辑
  }, [speedNum, speedTotalNum.length, incrementSpeed, decrementSpeed]);

  return {
    parkSwitch,
    trackSwitch,
    speedNum,
    handleMouseDownRA,
    handleMouseDownDEC,
    stop,
    mountPark,
    mountTrack,
    mountHome,
    mountSync,
    solveSync,
    mountSlewRateSwitch,
  };
};
