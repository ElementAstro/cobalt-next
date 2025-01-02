import * as React from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";
export type DeviceOS =
  | "iOS"
  | "Android"
  | "Windows"
  | "MacOS"
  | "Linux"
  | "Unknown";

interface DeviceInfo {
  isMobile: boolean;
  isLandscape: boolean;
  deviceType: DeviceType;
  isTouchDevice: boolean;
  isRetina: boolean;
  deviceOS: DeviceOS;
  isOnline: boolean;
  batteryLevel: number | null;
}

export function useDevice(
  mobileBreakpoint: number = 768,
  tabletBreakpoint: number = 1024
): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isLandscape: false,
    deviceType: "desktop",
    isTouchDevice: false,
    isRetina: false,
    deviceOS: "Unknown",
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    batteryLevel: null,
  });

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;

      let deviceType: DeviceType = "desktop";
      if (width < mobileBreakpoint) {
        deviceType = "mobile";
      } else if (width < tabletBreakpoint) {
        deviceType = "tablet";
      }

      let isMobile = deviceType === "mobile";

      let isLandscape = false;
      if (typeof window.orientation !== "undefined") {
        isLandscape = Math.abs(Number(window.orientation)) === 90;
      } else {
        isLandscape = aspectRatio > 1;
      }

      if (width > height && width < tabletBreakpoint) {
        deviceType = "mobile";
        isMobile = true;
        isLandscape = true;
      }

      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      const isRetina = window.devicePixelRatio > 1;

      const userAgent = navigator.userAgent;
      let deviceOS: DeviceOS = "Unknown";
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        deviceOS = "iOS";
      } else if (/Android/.test(userAgent)) {
        deviceOS = "Android";
      } else if (/Windows/.test(userAgent)) {
        deviceOS = "Windows";
      } else if (/Macintosh/.test(userAgent)) {
        deviceOS = "MacOS";
      } else if (/Linux/.test(userAgent)) {
        deviceOS = "Linux";
      }

      const isOnline = navigator.onLine;

      const updateBatteryStatus = async () => {
        if (typeof navigator !== "undefined" && "getBattery" in navigator) {
          const battery = await (navigator as any).getBattery();
          setDeviceInfo((prev) => ({
            ...prev,
            batteryLevel: battery.level,
          }));
        }
      };

      updateBatteryStatus();

      setDeviceInfo({
        isMobile,
        isLandscape,
        deviceType,
        isTouchDevice,
        isRetina,
        deviceOS,
        isOnline,
        batteryLevel: deviceInfo.batteryLevel,
      });
    };

    updateDeviceInfo();

    window.addEventListener("resize", updateDeviceInfo);

    if (typeof window.orientation !== "undefined") {
      window.addEventListener("orientationchange", updateDeviceInfo);
    }

    window.addEventListener("online", () =>
      setDeviceInfo((prev) => ({ ...prev, isOnline: true }))
    );
    window.addEventListener("offline", () =>
      setDeviceInfo((prev) => ({ ...prev, isOnline: false }))
    );
    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
      if (typeof window.orientation !== "undefined") {
        window.removeEventListener("orientationchange", updateDeviceInfo);
      }
      window.removeEventListener("online", () =>
        setDeviceInfo((prev) => ({ ...prev, isOnline: true }))
      );
      window.removeEventListener("offline", () =>
        setDeviceInfo((prev) => ({ ...prev, isOnline: false }))
      );
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  return deviceInfo;
}

export function useIsMobile(breakpoint: number = 768): boolean {
  const { isMobile, deviceType, isLandscape } = useDevice(breakpoint);

  // Consider a device mobile if:
  // 1. It's detected as mobile by screen size OR
  // 2. It's in landscape mode with a small screen OR
  // 3. Its deviceType is explicitly "mobile"
  return (
    isMobile &&
    deviceType === "mobile" &&
    (isLandscape && window.innerHeight < breakpoint)
  );
}
