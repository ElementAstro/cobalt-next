// lib/websocketClient.ts
import logger from "@/lib/logger";
import { useCameraStore } from "@/lib/store/device";
import { useMountStore } from "@/lib/store/device";
import { useFocuserStore } from "@/lib/store/device";
import { useFilterWheelStore } from "@/lib/store/device";
import { useGuiderStore } from "@/lib/store/device";
import { useDomeStore } from "@/lib/store/device";

const RECONNECT_INTERVAL = 5000; // 5 seconds reconnect interval

interface WebSocketMessage {
  device: string;
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
      logger.info("WebSocket connection opened.");
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = () => {
      logger.warn("WebSocket connection closed. Attempting to reconnect...");
      setTimeout(() => this.connect(), RECONNECT_INTERVAL);
    };

    this.socket.onerror = (error) => {
      logger.error("WebSocket encountered an error:", error);
      this.socket?.close();
    };
  }

  private handleMessage(message: string) {
    try {
      const parsed: WebSocketMessage = JSON.parse(message);
      const { device, data } = parsed;

      switch (device) {
        case "camera":
          this.updateCamera(data);
          break;
        case "mount":
          this.updateMount(data);
          break;
        case "focuser":
          this.updateFocuser(data);
          break;
        case "filterWheel":
          this.updateFilterWheel(data);
          break;
        case "guider":
          this.updateGuider(data);
          break;
        case "dome":
          this.updateDome(data);
          break;
        default:
          logger.warn(`Unknown device type: ${device}`);
      }
    } catch (error) {
      logger.error("Error processing WebSocket message:", error);
    }
  }

  private updateCamera(data: Record<string, any>) {
    const cameraStore = useCameraStore.getState();
    if (data.exposure !== undefined) cameraStore.setExposure(data.exposure);
    if (data.gain !== undefined) cameraStore.setGain(data.gain);
    if (data.offset !== undefined) cameraStore.setOffset(data.offset);
    if (data.binning !== undefined) cameraStore.setBinning(data.binning);
    if (data.coolerOn !== undefined) {
      data.coolerOn ? cameraStore.toggleCooler() : null;
    }
    if (data.isConnected !== undefined)
      cameraStore.setConnected(data.isConnected);
    // Add other Camera related updates
  }

  private updateMount(data: Record<string, any>) {
    const mountStore = useMountStore.getState();
    if (data.currentRA !== undefined) mountStore.setCurrentRA(data.currentRA);
    if (data.currentDec !== undefined)
      mountStore.setCurrentDec(data.currentDec);
    if (data.isConnected !== undefined)
      mountStore.setIsConnected(data.isConnected);
    if (data.isIdle !== undefined) mountStore.setIsIdle(data.isIdle);
    // Add other Mount related updates
  }

  private updateFocuser(data: Record<string, any>) {
    const focuserStore = useFocuserStore.getState();
    if (data.position !== undefined)
      focuserStore.setTargetPosition(data.position);
    if (data.isConnected !== undefined)
      focuserStore.setConnected(data.isConnected);
    // Add other Focuser related updates
  }

  private updateFilterWheel(data: Record<string, any>) {
    const filterWheelStore = useFilterWheelStore.getState();
    if (data.currentFilter !== undefined) {
      const index =
        filterWheelStore.filterWheelInfo.filters.indexOf(data.currentFilter) +
        1;
      filterWheelStore.changeFilter(index);
    }
    if (data.isConnected !== undefined)
      filterWheelStore.setConnected(data.isConnected);
    // Add other FilterWheel related updates
  }

  private updateGuider(data: Record<string, any>) {
    const guiderStore = useGuiderStore.getState();
    if (data.state !== undefined) {
      data.state === "Guiding"
        ? guiderStore.startGuiding()
        : guiderStore.stopGuiding();
    }
    if (data.isConnected !== undefined)
      guiderStore.setConnected(data.isConnected);
    // Add other Guider related updates
  }

  private updateDome(data: Record<string, any>) {
    const domeStore = useDomeStore.getState();
    if (data.azimuth !== undefined) domeStore.setAzimuth(data.azimuth);
    if (data.shutterStatus !== undefined)
      domeStore.setShutterStatus(data.shutterStatus);
    if (data.isConnected !== undefined)
      domeStore.setConnected(data.isConnected);
    if (data.temperature !== undefined)
      domeStore.setTemperature(data.temperature);
    // Add other Dome related updates
  }

  public sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      logger.warn("WebSocket is not connected. Unable to send message.");
    }
  }
}

export default WebSocketClient;
