import { SerialConfig, SerialData } from "../types/serial";

export class MockSerialService {
  private isConnected: boolean = false;
  private config: SerialConfig = {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
  };

  connect(config: SerialConfig): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.config = config;
        resolve();
      }, 500);
    });
  }

  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = false;
        resolve();
      }, 500);
    });
  }

  send(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error("Not connected"));
        return;
      }
      setTimeout(() => {
        console.log("Sent:", data);
        resolve();
      }, 100);
    });
  }

  onReceive(callback: (data: SerialData) => void): void {
    if (this.isConnected) {
      setInterval(() => {
        const mockData: SerialData = {
          type: "rx",
          data: `Mock data: ${Math.random().toString(36).substring(7)}`,
          timestamp: Date.now(),
        };
        callback(mockData);
      }, 2000);
    }
  }
}
