import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { NetworkBridgeConfig, useNetworkStore } from "@/lib/store/settings";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", damping: 15, stiffness: 300 },
  },
  exit: { scale: 0.9, opacity: 0 },
};

const formVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface NetworkBridgeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: NetworkBridgeConfig) => void;
}

export function NetworkBridgeConfigModal({
  isOpen,
  onClose,
  onSave,
}: NetworkBridgeConfigModalProps) {
  const { bridgeConfig, setBridgeConfig } = useNetworkStore();
  const [config, setConfig] = useState(bridgeConfig);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    setConfig(bridgeConfig);
  }, [bridgeConfig]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", checkOrientation);
    checkOrientation();

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBridgeConfig(config);
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg ${
              isLandscape ? "max-h-[90vh] overflow-y-auto" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                网络桥接配置
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={fieldVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <Label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    桥接名称
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={config.name}
                    onChange={handleChange}
                    placeholder="例如: br0"
                    required
                    className="mt-1 h-10 text-sm dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="interfaceMode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    接口模式
                  </Label>
                  <Select
                    value={config.interfaceMode}
                    onValueChange={(value) =>
                      handleSelectChange("interfaceMode", value)
                    }
                  >
                    <SelectTrigger className="h-10 dark:bg-gray-700">
                      <SelectValue placeholder="选择接口模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bridge">桥接</SelectItem>
                      <SelectItem value="bond">绑定</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
              {config.interfaceMode === "bond" && (
                <motion.div variants={fieldVariants}>
                  <Label
                    htmlFor="bondMode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    绑定模式
                  </Label>
                  <Select
                    value={config.bondMode}
                    onValueChange={(value) =>
                      handleSelectChange("bondMode", value)
                    }
                  >
                    <SelectTrigger className="h-10 dark:bg-gray-700">
                      <SelectValue placeholder="选择绑定模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active-backup">主备模式</SelectItem>
                      <SelectItem value="balance-tlb">
                        适配器传输负载均衡
                      </SelectItem>
                      <SelectItem value="balance-alb">
                        适配器负载均衡
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
              <motion.div
                variants={fieldVariants}
                className="flex items-center justify-between"
              >
                <Label
                  htmlFor="dhcp"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  启用DHCP
                </Label>
                <Switch
                  id="dhcp"
                  name="dhcp"
                  checked={config.dhcp}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, dhcp: checked }))
                  }
                />
              </motion.div>
              {!config.dhcp && (
                <motion.div
                  variants={fieldVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <Label
                      htmlFor="ipAddress"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      IP 地址
                    </Label>
                    <Input
                      id="ipAddress"
                      name="ipAddress"
                      value={config.ipAddress}
                      onChange={handleChange}
                      placeholder="例如: 192.168.1.100"
                      required={!config.dhcp}
                      className="mt-1 h-10 text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="subnetMask"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      子网掩码
                    </Label>
                    <Input
                      id="subnetMask"
                      name="subnetMask"
                      value={config.subnetMask}
                      onChange={handleChange}
                      placeholder="例如: 255.255.255.0"
                      required={!config.dhcp}
                      className="mt-1 h-10 text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="gateway"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      网关
                    </Label>
                    <Input
                      id="gateway"
                      name="gateway"
                      value={config.gateway}
                      onChange={handleChange}
                      placeholder="例如: 192.168.1.1"
                      required={!config.dhcp}
                      className="mt-1 h-10 text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="mtu"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      MTU
                    </Label>
                    <Input
                      id="mtu"
                      name="mtu"
                      value={config.mtu}
                      onChange={handleChange}
                      placeholder="例如: 1500"
                      type="number"
                      min="68"
                      max="9000"
                      className="mt-1 h-10 text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </motion.div>
              )}
              <motion.div
                variants={fieldVariants}
                className="flex justify-end space-x-3 mt-6"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-10 text-sm"
                >
                  取消
                </Button>
                <Button type="submit" className="h-10 text-sm">
                  保存
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
