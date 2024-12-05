import { useState } from "react";
import { Wifi, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface WifiNetwork {
  ssid: string;
  signal: number;
  secure: boolean;
}

interface WifiListProps {
  isDarkMode: boolean;
}

export function WifiList({ isDarkMode }: WifiListProps) {
  const [networks, setNetworks] = useState<WifiNetwork[]>([
    { ssid: "Home Network", signal: 90, secure: true },
    { ssid: "Coffee Shop", signal: 70, secure: false },
    { ssid: "Office WiFi", signal: 85, secure: true },
  ]);

  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(
    null
  );
  const [password, setPassword] = useState("");

  const handleConnect = (network: WifiNetwork) => {
    setSelectedNetwork(network);
  };

  const handleSubmit = () => {
    console.log(
      `Connecting to ${selectedNetwork?.ssid} with password: ${password}`
    );
    setSelectedNetwork(null);
    setPassword("");
  };

  return (
    <div className="space-y-2">
      {networks.map((network) => (
        <motion.div
          key={network.ssid}
          className={`flex items-center justify-between p-2 rounded-md ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <Wifi
              className={`h-5 w-5 ${
                network.signal > 70 ? "text-green-500" : "text-yellow-500"
              }`}
            />
            <span>{network.ssid}</span>
            {network.secure && <Lock className="h-4 w-4" />}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConnect(network)}
              >
                连接
              </Button>
            </DialogTrigger>
            <DialogContent
              className={
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }
            >
              <DialogHeader>
                <DialogTitle>连接到 {network.ssid}</DialogTitle>
                <DialogDescription>
                  请输入网络密码以连接到 {network.ssid}
                </DialogDescription>
              </DialogHeader>
              <Input
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedNetwork(null)}
                >
                  取消
                </Button>
                <Button onClick={handleSubmit}>连接</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      ))}
    </div>
  );
}
