"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import Script from "next/script";
import { debounce } from "lodash";

interface AladinProps {
  ra: number;
  dec: number;
  fov: number;
  onCenterChange?: (ra: number, dec: number) => void;
  fov_points?: Array<
    [[number, number], [number, number], [number, number], [number, number]]
  >;
  fov_size?: number;
}

declare global {
  interface Window {
    A: any;
  }
}

const AladinComponent: React.FC<AladinProps> = ({
  ra,
  dec,
  fov,
  onCenterChange,
  fov_points,
  fov_size,
}) => {
  const alaRef = useRef<HTMLDivElement>(null);
  const aladinInstance = useRef<any>(null);
  const isInitialized = useRef(false);

  // 缓存中心点变化回调
  const handleCenterChange = useCallback(
    debounce((newRa: number, newDec: number) => {
      onCenterChange?.(newRa, newDec);
    }, 100),
    [onCenterChange]
  );

  // 初始化 Aladin
  useEffect(() => {
    if (!window.A || isInitialized.current) return;

    const initAladin = () => {
      aladinInstance.current = window.A.aladin(alaRef.current, {
        fov,
        projection: "AIT",
        cooFrame: "equatorial",
        showCooGridControl: true,
        showSimbadPointerControl: true,
        showCooGrid: true,
        survey: "P/DSS2/color",
        showProjectionControl: false,
        showZoomControl: false,
        showFullscreenControl: false,
        showLayersControl: false,
        showGotoControl: false,
        showFrame: false,
        cooframe: "equatorial",
        showSimbadPointrerControl: false,
      });

      if (onCenterChange) {
        aladinInstance.current.on("zoomChanged", () => {
          const center = aladinInstance.current.getRaDec();
          handleCenterChange(center[0], center[1]);
        });

        aladinInstance.current.on("positionChanged", () => {
          const center = aladinInstance.current.getRaDec();
          handleCenterChange(center[0], center[1]);
        });
      }

      isInitialized.current = true;
    };

    initAladin();

    return () => {
      isInitialized.current = false;
      if (aladinInstance.current) {
        // 清理实例
        aladinInstance.current.destroy?.();
        aladinInstance.current = null;
      }
    };
  }, []); // 仅在组件挂载时初始化

  // 更新位置
  useEffect(() => {
    if (!aladinInstance.current) return;

    const debouncedGoto = debounce(() => {
      aladinInstance.current.gotoRaDec(ra, dec);
    }, 100);

    debouncedGoto();
    return () => debouncedGoto.cancel();
  }, [ra, dec]);

  // 更新视场
  useEffect(() => {
    if (!aladinInstance.current || !fov_size) return;

    const debouncedSetFov = debounce(() => {
      aladinInstance.current.setFoV(fov_size);
    }, 100);

    debouncedSetFov();
    return () => debouncedSetFov.cancel();
  }, [fov_size]);

  // 更新 FOV 点
  useEffect(() => {
    if (!aladinInstance.current || !fov_points) return;

    // 清除现有的 footprints
    aladinInstance.current.removeLayers();

    // 添加新的 footprints
    fov_points.forEach((points) => {
      aladinInstance.current.addFootprints(window.A.polygon(points));
    });
  }, [fov_points]);

  return (
    <>
      <Script
        src="https://aladin.u-strasbg.fr/AladinLite/api/v3/latest/aladin.js"
        strategy="beforeInteractive"
      />
      <div
        ref={alaRef}
        style={{ width: "100%", height: "100%" }}
        className="relative rounded-lg overflow-hidden"
      />
    </>
  );
};

// 使用 memo 包装组件以避免不必要的重渲染
const Aladin = memo(AladinComponent);

export default Aladin;
