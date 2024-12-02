import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiService } from "@/services/api";

interface DeviceData {
  name: string;
  type: string;
  connected: boolean;
}

export function DevicesTab() {
  const { fetchDevices, connectDevice, disconnectDevice } = useApiService();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [remoteDrivers, setRemoteDrivers] = useState(
    "driver@host:port,driver@host,@host:port,@host,driver"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDevices().then(setDevices);
  }, [fetchDevices]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) =>
      device.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [devices, search]);

  const handleConnect = async (deviceName: string) => {
    try {
      const updatedDevice = await connectDevice(deviceName);
      setDevices(
        devices.map((d) => (d.name === deviceName ? updatedDevice : d))
      );
    } catch (error) {
      console.error("Failed to connect device:", error);
    }
  };

  const handleDisconnect = async (deviceName: string) => {
    try {
      const updatedDevice = await disconnectDevice(deviceName);
      setDevices(
        devices.map((d) => (d.name === deviceName ? updatedDevice : d))
      );
    } catch (error) {
      console.error("Failed to disconnect device:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="搜索设备..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="grid md:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <div key={device.name} className="space-y-2">
            <Label htmlFor={device.name.toLowerCase().replace(" ", "-")}>
              {device.name}
            </Label>
            <Select value={device.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={device.type}>{device.type}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={device.connected ? "destructive" : "default"}
              size="sm"
              onClick={() =>
                device.connected
                  ? handleDisconnect(device.name)
                  : handleConnect(device.name)
              }
            >
              {device.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
      <div>
        <Label htmlFor="remote">Remote Drivers</Label>
        <Input
          id="remote"
          value={remoteDrivers}
          onChange={(e) => setRemoteDrivers(e.target.value)}
          className="font-mono text-sm mt-1"
        />
      </div>
    </div>
  );
}
