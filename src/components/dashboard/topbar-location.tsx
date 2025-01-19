"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Location, useDashboardStore } from "@/store/useDashboardStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Check, X, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StaticMap from "@/components/information/static-map";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import GeocodingComponent from "@/components/information/geo-coding";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import wsClient from "@/utils/ws-client";

const messageBus = wsClient
  ? new MessageBus(wsClient, {
      logLevel: LogLevel.DEBUG,
      maxRetries: 5,
      retryDelay: 2000,
    })
  : null;

export default function TopbarLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    type: "permission" | "timeout" | "unavailable" | "network" | "other";
    message: string;
  } | null>(null);
  const location = useDashboardStore<Location | null>(
    (state) => state.location
  );
  const setLocation = useDashboardStore((state) => state.setLocation);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const controls = useAnimation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [manualInputVisible, setManualInputVisible] = useState(false);
  const [manualCoords, setManualCoords] = useState({ lat: "", lon: "" });

  useEffect(() => {
    if (!location) {
      fetchLocation();
    }

    // Subscribe to location update confirmations
    let unsubscribe = () => {};
    if (messageBus) {
      unsubscribe = messageBus.subscribe(
        "sync-location-response",
        (message: any, topic?: string) => {
          if (message.status === "success") {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          } else {
            setError({ type: "network", message: "同步位置信息失败。" });
          }
        }
      );
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError({ type: "unavailable", message: "浏览器不支持地理位置获取。" });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        syncLocationToBackend(latitude, longitude);
        setLoading(false);
      },
      () => {
        setError({ type: "other", message: "无法获取位置信息。" });
        setLoading(false);
      }
    );
  };

  const syncLocationToBackend = (lat: number, lon: number) => {
    if (messageBus) {
      messageBus.publish("sync-location", { latitude: lat, longitude: lon });
    }
  };

  const handleLocationUpdate = (location: Location) => {
    setLocation(location);
    syncLocationToBackend(location.latitude, location.longitude);
  };

  const handleMapClick = (coordinates: string) => {
    const [longitude, latitude] = coordinates.split(",").map(Number);
    handleLocationUpdate({ latitude, longitude });
  };

  return (
    <TooltipProvider>
      <div className="flex items-center">
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" aria-label="获取当前位置">
              <MapPin className="w-4 h-4 text-white" />
            </Button>
          </TooltipTrigger>
          <AnimatePresence>
            {isTooltipOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.3,
                }}
                onHoverStart={() => controls.start({ scale: 1.02 })}
                onHoverEnd={() => controls.start({ scale: 1 })}
              >
                <TooltipContent className="w-80 p-4 bg-gray-800 text-white rounded-md shadow-lg">
                  <motion.div
                    className="w-full mb-4 rounded-lg overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <StaticMap
                      location={location || undefined}
                      key="44fc0016a614cb00ed9d8000eb8f9428"
                      zoom={10}
                      size="400*400"
                      onMapClick={handleMapClick}
                      showControls={true}
                      showZoomButtons={true}
                      allowFullscreen={true}
                      showScale={true}
                      theme="dark"
                      features={["road", "building", "point"]}
                      onLocationChange={handleLocationUpdate}
                    />
                  </motion.div>
                  <GeocodingComponent onLocationSelect={handleLocationUpdate} />

                  {manualInputVisible ? (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">纬度</Label>
                          <Input
                            id="latitude"
                            type="text"
                            placeholder="-90 到 90"
                            value={manualCoords.lat}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^-?\d*\.?\d*$/.test(value)) {
                                setManualCoords((prev) => ({
                                  ...prev,
                                  lat: value,
                                }));
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">经度</Label>
                          <Input
                            id="longitude"
                            type="text"
                            placeholder="-180 到 180"
                            value={manualCoords.lon}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^-?\d*\.?\d*$/.test(value)) {
                                setManualCoords((prev) => ({
                                  ...prev,
                                  lon: value,
                                }));
                              }
                            }}
                          />
                        </div>
                      </div>
                      {(parseFloat(manualCoords.lat) < -90 ||
                        parseFloat(manualCoords.lat) > 90 ||
                        parseFloat(manualCoords.lon) < -180 ||
                        parseFloat(manualCoords.lon) > 180) && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            请输入有效的经纬度范围：纬度 -90 到 90，经度 -180 到
                            180
                          </AlertDescription>
                        </Alert>
                      )}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => {
                            const lat = parseFloat(manualCoords.lat);
                            const lon = parseFloat(manualCoords.lon);
                            if (
                              !isNaN(lat) &&
                              !isNaN(lon) &&
                              lat >= -90 &&
                              lat <= 90 &&
                              lon >= -180 &&
                              lon <= 180
                            ) {
                              handleLocationUpdate({
                                latitude: lat,
                                longitude: lon,
                              });
                              setManualInputVisible(false);
                            }
                          }}
                        >
                          确认
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setManualInputVisible(false);
                            setManualCoords({ lat: "", lon: "" });
                          }}
                        >
                          取消
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setManualInputVisible(true)}
                    >
                      手动输入位置
                    </Button>
                  )}

                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsTooltipOpen(false)}
                      aria-label="取消获取位置"
                    >
                      取消
                    </Button>
                    <Button
                      className="w-full"
                      onClick={fetchLocation}
                      variant={error ? "destructive" : "outline"}
                      aria-label="使用当前位置"
                    >
                      使用当前位置
                    </Button>
                  </motion.div>
                </TooltipContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tooltip>
        {loading && (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.3,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            >
              <Loader2 className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        )}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="flex items-center bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-md shadow-lg"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.3,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Check className="w-4 h-4 mr-2" />
              </motion.div>
              位置已更新
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <AnimatePresence>
            <motion.div
              className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-md shadow-lg"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.3,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X className="w-4 h-4 mr-2" />
              </motion.div>
              <div className="flex-1">{error?.message}</div>
              {error.type !== "unavailable" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700/50"
                  onClick={fetchLocation}
                >
                  重试
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
        {location && (
          <motion.div
            className="flex flex-col text-sm text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.3,
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>纬度: {location.latitude.toFixed(2)}</span>
              <span>经度: {location.longitude.toFixed(2)}</span>
            </div>
            <motion.div
              className="text-xs text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              最后更新: {new Date().toLocaleTimeString()}
            </motion.div>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed top-4 right-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Alert>
              <AlertTitle>成功</AlertTitle>
              <AlertDescription>您的位置已成功更新。</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
