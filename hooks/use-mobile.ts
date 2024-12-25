import * as React from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceInfo {
  isMobile: boolean;
  isLandscape: boolean;
  deviceType: DeviceType;
}

export function useDevice(mobileBreakpoint: number = 768, tabletBreakpoint: number = 1024): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isLandscape: false,
    deviceType: "desktop"
  });

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      
      // 检测设备类型
      let deviceType: DeviceType = "desktop";
      if (width < mobileBreakpoint) {
        deviceType = "mobile";
      } else if (width < tabletBreakpoint) {
        deviceType = "tablet";
      }

      // 检测是否是移动设备
      let isMobile = deviceType === "mobile";

      // 检测是否横屏
      // 1. 使用方向检测 (如果支持)
      // 2. 使用屏幕比例作为备选方案
      let isLandscape = false;
      
      if (typeof window.orientation !== 'undefined') {
        isLandscape = Math.abs(Number(window.orientation)) === 90;
      } else {
        isLandscape = aspectRatio > 1;
      }

      // 特殊情况处理: iPad等设备在横屏时可能会被误判
      // 如果设备宽度大于高度但小于平板临界值,认为是移动设备横屏
      if (width > height && width < tabletBreakpoint) {
        deviceType = "mobile";
        isMobile = true;
        isLandscape = true;
      }

      setDeviceInfo({
        isMobile,
        isLandscape,
        deviceType,
      });
    };

    // 初始检测
    updateDeviceInfo();

    // 监听屏幕变化
    window.addEventListener('resize', updateDeviceInfo);
    
    // 监听方向变化
    if (typeof window.orientation !== 'undefined') {
      window.addEventListener('orientationchange', updateDeviceInfo);
    }

    // 清理监听器
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      if (typeof window.orientation !== 'undefined') {
        window.removeEventListener('orientationchange', updateDeviceInfo);
      }
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  return deviceInfo;
}

// 向后兼容的 useIsMobile
export function useIsMobile(breakpoint: number = 768): boolean {
  const { isMobile } = useDevice(breakpoint);
  return isMobile;
}