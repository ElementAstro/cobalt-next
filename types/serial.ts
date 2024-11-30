export interface SerialConfig {
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: "none" | "even" | "odd";
}

export interface SerialData {
  type: "rx" | "tx";
  data: string;
  timestamp: number;
}

export interface SerialPort {
  id: string;
  name: string;
  isConnected: boolean;
  config: SerialConfig;
  data: SerialData[];
  rxCount: number;
  txCount: number;
}

export interface SerialState {
  ports: SerialPort[];
  activePortId: string | null;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}
