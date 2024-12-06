export interface WiFiNetwork {
  id: string;
  name: string;
  signalStrength: number;
  isSecure: boolean;
  frequency: string;
  isConnected?: boolean;
  status?: string;
  lastConnected?: string;
  recent
}
