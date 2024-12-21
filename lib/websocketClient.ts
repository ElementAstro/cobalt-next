import logger from "@/lib/logger";
import { useCameraStore, CameraStatus } from "@/lib/store/device/camera";
import { useMountStore } from "@/lib/store/device/telescope";
import { useFocuserStore } from "@/lib/store/device/focuser";
import { useFilterWheelStore } from "@/lib/store/device/filterwheel";
import { useGuiderStore } from "@/lib/store/device/guiding";
import { useDomeStore } from "@/lib/store/device/dome";
import { useWeatherStore, WeatherDataPoint } from "@/lib/store/device/weather";
import { useRotatorStore } from "@/lib/store/device/rotation";
import {
  useDeviceSelectorStore,
  DeviceType,
} from "@/lib/store/device/selector";
import { useToast } from "@/hooks/use-toast";

const RECONNECT_INTERVAL = 5000;

interface WebSocketMessage {
  device: DeviceType | "weather";
  data: Record<string, any>;
}

class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      logger.info("WebSocket 连接已打开", {
        type: "system",
        source: "websocket",
      });
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = () => {
      logger.warn("WebSocket 连接已关闭。尝试重新连接...", {
        type: "system",
        source: "websocket",
      });
      setTimeout(() => this.connect(), RECONNECT_INTERVAL);
    };

    this.socket.onerror = (error) => {
      logger.error("WebSocket 遇到错误:", error, {
        type: "system",
        source: "websocket",
      });
      this.socket?.close();
    };
  }

  private handleMessage(message: string) {
    try {
      const parsed: WebSocketMessage = JSON.parse(message);
      const { device, data } = parsed;

      const selectorStore = useDeviceSelectorStore.getState();

      switch (device) {
        case "Camera":
          this.updateCamera(data);
          break;
        case "Telescope":
          this.updateMount(data);
          break;
        case "Focuser":
          this.updateFocuser(data);
          break;
        case "FilterWheel":
          this.updateFilterWheel(data);
          break;
        case "Guider":
          this.updateGuider(data);
          break;
        case "Dome":
          this.updateDome(data);
          break;
        case "weather":
          this.updateWeather(data);
          break;
        case "Rotator":
          this.updateRotator(data);
          break;
        default:
          logger.warn(`未知的设备类型: ${device}`, {
            type: "system",
            source: "websocket",
          });
      }

      // 更新设备选择器状态
      if (device !== "weather") {
        selectorStore.setDevices([
          ...selectorStore.devices,
          {
            id: data.id || crypto.randomUUID(),
            name: data.name || device,
            type: device,
            firmware: data.firmware || "unknown",
            serial: data.serial || "unknown",
            lastConnected: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      logger.error("处理 WebSocket 消息时出错:", error, {
        type: "system",
        source: "websocket",
      });
    }
  }

  private updateCamera(data: Partial<CameraStatus>) {
    const cameraStore = useCameraStore.getState();
    const { toast } = useToast();

    // Core camera parameters update with validation
    if (data.exposure !== undefined) {
      if (data.exposure < 0.001 || data.exposure > 3600) {
        toast({
          title: "Invalid Exposure Setting",
          description: "Exposure must be between 0.001 and 3600 seconds",
          variant: "destructive",
        });
      } else {
        cameraStore.setExposure(data.exposure);
      }
    }

    if (data.gain !== undefined) {
      if (data.gain < 0 || data.gain > 100) {
        toast({
          title: "Invalid Gain Setting",
          description: "Gain must be between 0 and 100",
          variant: "destructive",
        });
      } else {
        cameraStore.setGain(data.gain);
      }
    }

    if (data.iso !== undefined) {
      const validISOs = [
        100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200,
      ];
      if (!validISOs.includes(data.iso)) {
        toast({
          title: "Invalid ISO Setting",
          description:
            "ISO must be one of: 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200",
          variant: "destructive",
        });
      } else {
        cameraStore.setISO(data.iso);
      }
    }

    if (data.offset !== undefined) {
      if (data.offset < 0 || data.offset > 1000) {
        toast({
          title: "Invalid Offset Setting",
          description: "Offset must be between 0 and 1000",
          variant: "destructive",
        });
      } else {
        cameraStore.setOffset(data.offset);
      }
    }

    if (data.binning !== undefined) {
      const validBinning = [1, 2, 3, 4];
      if (!validBinning.includes(data.binning)) {
        toast({
          title: "Invalid Binning Setting",
          description: "Binning must be one of: 1, 2, 3, 4",
          variant: "destructive",
        });
      } else {
        cameraStore.setBinning(data.binning);
      }
    }

    // Temperature validation
    if (data.temperature !== undefined) {
      if (data.temperature < -50 || data.temperature > 50) {
        toast({
          title: "Temperature Warning",
          description: "Temperature is outside normal range (-50°C to 50°C)",
          variant: "destructive",
        });
      }
      cameraStore.setTemperature(data.temperature);
      cameraStore.addTemperatureHistory({
        time: new Date().toISOString(),
        temperature: data.temperature,
      });
    }

    // Cooling power validation
    if (data.power !== undefined) {
      if (data.power < 0 || data.power > 100) {
        toast({
          title: "Invalid Cooling Power",
          description: "Cooling power must be between 0 and 100%",
          variant: "destructive",
        });
      } else {
        cameraStore.setCurrentCoolingPower(data.power);
      }
    }

    // Target temperature validation
    if (data.targetTemperature !== undefined) {
      if (data.targetTemperature < -30 || data.targetTemperature > 20) {
        toast({
          title: "Invalid Target Temperature",
          description: "Target temperature must be between -30°C and 20°C",
          variant: "destructive",
        });
      } else {
        cameraStore.setTargetTemperature(data.targetTemperature);
      }
    }

    // Target cooling power validation
    if (data.targetCoolingPower !== undefined) {
      if (data.targetCoolingPower < 0 || data.targetCoolingPower > 100) {
        toast({
          title: "Invalid Target Cooling Power",
          description: "Target cooling power must be between 0 and 100%",
          variant: "destructive",
        });
      } else {
        cameraStore.setTargetCoolingPower(data.targetCoolingPower);
      }
    }

    // Connection status
    if (data.isConnected !== undefined) {
      cameraStore.setConnected(data.isConnected);
      toast({
        title: data.isConnected ? "Camera Connected" : "Camera Disconnected",
        variant: data.isConnected ? "default" : "destructive",
      });
    }

    // Cooler status
    if (data.coolerOn !== undefined) {
      if (data.coolerOn) {
        if (data.temperature && data.temperature > 30) {
          toast({
            title: "Cooler Warning",
            description: "Camera temperature is too high to activate cooling",
            variant: "destructive",
          });
        } else {
          cameraStore.toggleCooler();
          toast({
            title: "Cooler Activated",
            description: "Camera cooling system has been turned on",
          });
        }
      } else {
        cameraStore.toggleCooler();
        toast({
          title: "Cooler Deactivated",
          description: "Camera cooling system has been turned off",
        });
      }
    }

    // Temperature trend monitoring
    if (data.temperature !== undefined) {
      const temperatureHistory = cameraStore.temperatureHistory;
      if (temperatureHistory.length > 1) {
        const lastTemp =
          temperatureHistory[temperatureHistory.length - 2].temperature;
        const tempChange = Math.abs(data.temperature - lastTemp);
        if (tempChange > 2) {
          toast({
            title: "Rapid Temperature Change",
            description: `Temperature changed by ${tempChange.toFixed(1)}°C`,
            variant: "destructive",
          });
        }
      }
    }
  }

  private updateMount(data: Record<string, any>) {
    const mountStore = useMountStore.getState();
    if (data.currentRA !== undefined) mountStore.setCurrentRA(data.currentRA);
    if (data.currentDec !== undefined)
      mountStore.setCurrentDec(data.currentDec);
    if (data.currentAz !== undefined) mountStore.setCurrentAz(data.currentAz);
    if (data.currentAlt !== undefined)
      mountStore.setCurrentAlt(data.currentAlt);
    if (data.isConnected !== undefined)
      mountStore.setIsConnected(data.isConnected);
    if (data.isIdle !== undefined) mountStore.setIsIdle(data.isIdle);
    if (data.parkSwitch !== undefined) mountStore.toggleParkSwitch();
    if (data.homeSwitch !== undefined) mountStore.toggleHomeSwitch();
    if (data.trackSwitch !== undefined) mountStore.toggleTrackSwitch();
    if (data.speedNum !== undefined) mountStore.setSpeedNum(data.speedNum);
    if (data.speedTotalNum !== undefined)
      mountStore.setSpeedTotalNum(data.speedTotalNum);

    // 增加设备局部参数刷新
    this.refreshMountPartialParameters(data);
  }

  private refreshMountPartialParameters(data: Record<string, any>) {
    const mountStore = useMountStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  private updateFocuser(data: Record<string, any>) {
    const focuserStore = useFocuserStore.getState();
    if (data.position !== undefined)
      focuserStore.setTargetPosition(data.position);
    if (data.temperature !== undefined)
      focuserStore.setTemperature(data.temperature);
    if (data.backflash !== undefined) focuserStore.setBackflash(data.backflash);
    if (data.temperatureCompensation !== undefined)
      focuserStore.setTemperatureCompensation(data.temperatureCompensation);
    if (data.backflashCompensation !== undefined)
      focuserStore.setBackflashCompensation(data.backflashCompensation);
    if (data.stepSize !== undefined) focuserStore.setStepSize(data.stepSize);
    if (data.maxPosition !== undefined)
      focuserStore.setMaxPosition(data.maxPosition);
    if (data.minPosition !== undefined)
      focuserStore.setMinPosition(data.minPosition);
    if (data.isMoving !== undefined) focuserStore.setIsMoving(data.isMoving);
    if (data.isConnected !== undefined)
      focuserStore.setConnected(data.isConnected);

    // 增加设备局部参数刷新
    this.refreshFocuserPartialParameters(data);
  }

  private refreshFocuserPartialParameters(data: Record<string, any>) {
    const focuserStore = useFocuserStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  private updateFilterWheel(data: Record<string, any>) {
    const filterWheelStore = useFilterWheelStore.getState();
    if (data.currentFilter !== undefined) {
      const index =
        filterWheelStore.filterWheelInfo.filters.indexOf(data.currentFilter) +
        1;
      filterWheelStore.changeFilter(index);
    }
    if (data.position !== undefined)
      filterWheelStore.setPosition(data.position);
    if (data.maxPosition !== undefined)
      filterWheelStore.setMaxPosition(data.maxPosition);
    if (data.minPosition !== undefined)
      filterWheelStore.setMinPosition(data.minPosition);
    if (data.isMoving !== undefined)
      filterWheelStore.setIsMoving(data.isMoving);
    if (data.isConnected !== undefined)
      filterWheelStore.setConnected(data.isConnected);

    // 增加设备局部参数刷新
    this.refreshFilterWheelPartialParameters(data);
  }

  private refreshFilterWheelPartialParameters(data: Record<string, any>) {
    const filterWheelStore = useFilterWheelStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  private updateGuider(data: Record<string, any>) {
    const guiderStore = useGuiderStore.getState();
    if (data.state !== undefined) {
      data.state === "Guiding"
        ? guiderStore.startGuiding()
        : guiderStore.stopGuiding();
    }
    if (data.exposureTime !== undefined)
      guiderStore.setExposureTime(data.exposureTime);
    if (data.calibrationStatus !== undefined)
      guiderStore.setCalibrationStatus(data.calibrationStatus);
    if (data.guidingAccuracy !== undefined)
      guiderStore.setGuidingAccuracy(data.guidingAccuracy);
    if (data.isCalibrating !== undefined)
      guiderStore.setCalibrating(data.isCalibrating);
    if (data.lastError !== undefined) guiderStore.setLastError(data.lastError);
    if (data.guidingStats !== undefined)
      guiderStore.setGuidingStats(data.guidingStats);
    if (data.isConnected !== undefined)
      guiderStore.setConnected(data.isConnected);

    // 增加设备局部参数刷新
    this.refreshGuiderPartialParameters(data);
  }

  private refreshGuiderPartialParameters(data: Record<string, any>) {
    const guiderStore = useGuiderStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  private updateDome(data: Record<string, any>) {
    const domeStore = useDomeStore.getState();
    if (data.azimuth !== undefined) domeStore.setAzimuth(data.azimuth);
    if (data.shutterStatus !== undefined)
      domeStore.setShutterStatus(data.shutterStatus);
    if (data.isConnected !== undefined)
      domeStore.setConnected(data.isConnected);
    if (data.isSynced !== undefined) domeStore.setSynced(data.isSynced);
    if (data.isSlewing !== undefined) domeStore.setSlewing(data.isSlewing);
    if (data.error !== undefined) domeStore.setError(data.error);
    if (data.temperature !== undefined)
      domeStore.setTemperature(data.temperature);
    if (data.humidity !== undefined) domeStore.setHumidity(data.humidity);
    if (data.pressure !== undefined) domeStore.setPressure(data.pressure);
    if (data.windSpeed !== undefined) domeStore.setWindSpeed(data.windSpeed);
    if (data.rainStatus !== undefined) domeStore.setRainStatus(data.rainStatus);

    // 增加设备局部参数刷新
    this.refreshDomePartialParameters(data);
  }

  private refreshDomePartialParameters(data: Record<string, any>) {
    const domeStore = useDomeStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  private updateWeather(data: Record<string, any>) {
    const weatherStore = useWeatherStore.getState();
    if (data.temperature !== undefined)
      weatherStore.setTemperature(data.temperature);
    if (data.humidity !== undefined) weatherStore.setHumidity(data.humidity);
    if (data.pressure !== undefined) weatherStore.setPressure(data.pressure);
    if (data.windSpeed !== undefined) weatherStore.setWindSpeed(data.windSpeed);
    if (data.windDirection !== undefined)
      weatherStore.setWindDirection(data.windDirection);
    if (data.timestamp !== undefined) {
      weatherStore.addDataPoint({
        timestamp: data.timestamp,
        temperature: data.temperature,
        humidity: data.humidity,
      });
    }

    // 增加设备局部参数刷新
    this.refreshWeatherPartialParameters(data);
  }

  private refreshWeatherPartialParameters(data: Record<string, any>) {
    const weatherStore = useWeatherStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  private updateRotator(data: Record<string, any>) {
    const rotatorStore = useRotatorStore.getState();
    if (data.isMoving !== undefined) rotatorStore.setIsMoving(data.isMoving);
    if (data.reverse !== undefined) rotatorStore.setReverse(data.reverse);
    if (data.mechanicalPosition !== undefined)
      rotatorStore.setMechanicalPosition(data.mechanicalPosition);
    if (data.targetPosition !== undefined)
      rotatorStore.setTargetPosition(data.targetPosition);
    if (data.speed !== undefined) rotatorStore.setSpeed(data.speed);
    if (data.mechanicalRange !== undefined)
      rotatorStore.setMechanicalRange(data.mechanicalRange);

    // 增加设备局部参数刷新
    this.refreshRotatorPartialParameters(data);
  }

  private refreshRotatorPartialParameters(data: Record<string, any>) {
    const rotatorStore = useRotatorStore.getState();
    // 根据需要添加局部参数刷新逻辑
  }

  public sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      logger.warn("WebSocket 未连接。无法发送消息。", {
        type: "system",
        source: "websocket",
      });
    }
  }
}

export default WebSocketClient;
