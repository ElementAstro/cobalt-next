import { SerialConfig, SerialData } from "../types/serial";

export class RealSerialService {
  private socket: WebSocket | null = null;

  connect(config: SerialConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket("ws://localhost:8080");
      this.socket.onopen = () => {
        this.socket?.send(JSON.stringify({ type: "connect", config }));
        resolve();
      };
      this.socket.onerror = (error) => {
        reject(error);
      };
    });
  }

  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket) {
        this.socket.send(JSON.stringify({ type: "disconnect" }));
        this.socket.close();
        this.socket = null;
      }
      resolve();
    });
  }

  send(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Not connected"));
        return;
      }
      this.socket.send(JSON.stringify({ type: "send", data }));
      resolve();
    });
  }

  onReceive(callback: (data: SerialData) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "receive") {
          callback(data.data);
        }
      };
    }
  }
}
