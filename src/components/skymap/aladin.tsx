"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import Script from "next/script";
import { debounce } from "lodash";
import { motion } from "framer-motion";

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

  const handleCenterChange = useCallback(
    debounce((newRa: number, newDec: number) => {
      onCenterChange?.(newRa, newDec);
    }, 100),
    [onCenterChange]
  );

  useEffect(() => {
    if (isInitialized.current) return;

    const initAladin = () => {
      window.A.init().then(() => {
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
          useWebGL2: true, // Enable WebGL2 rendering
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
      });
    };

    initAladin();

    return () => {
      isInitialized.current = false;
      if (aladinInstance.current) {
        aladinInstance.current.destroy?.();
        aladinInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!aladinInstance.current) return;

    const debouncedGoto = debounce(() => {
      aladinInstance.current.gotoRaDec(ra, dec);
    }, 100);

    debouncedGoto();
    return () => debouncedGoto.cancel();
  }, [ra, dec]);

  useEffect(() => {
    if (!aladinInstance.current || !fov_size) return;

    const debouncedSetFov = debounce(() => {
      aladinInstance.current.setFoV(fov_size);
    }, 100);

    debouncedSetFov();
    return () => debouncedSetFov.cancel();
  }, [fov_size]);

  useEffect(() => {
    if (!aladinInstance.current || !fov_points) return;

    aladinInstance.current.removeLayers();
    fov_points.forEach((points) => {
      aladinInstance.current.addFootprints(window.A.polygon(points));
    });
  }, [fov_points]);

  useEffect(() => {
    if (!aladinInstance.current) return;

    const updatePerformance = () => {
      // 优化渲染性能
      aladinInstance.current.setImageQuality('low');
      
      // 添加平滑过渡
      aladinInstance.current.setTransitionParams({
        duration: 1000,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });

      // 添加自定义控件
      aladinInstance.current.addCustomControl({
        id: 'quality-toggle',
        title: '切换图像质量',
        position: 'top-right',
        callback: () => {
          const currentQuality = aladinInstance.current.getImageQuality();
          aladinInstance.current.setImageQuality(
            currentQuality === 'low' ? 'high' : 'low'
          );
        }
      });
    };

    updatePerformance();
  }, []);

  return (
    <>
      <Script
        src="https://aladin.cds.unistra.fr/AladinLite/api/v3/3.2.0/aladin.js"
        strategy="beforeInteractive"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full"
      >
        <div
          ref={alaRef}
          className="w-full h-full rounded-lg overflow-hidden shadow-lg"
        />
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      </motion.div>
    </>
  );
};

const Aladin = memo(AladinComponent);

export default Aladin;
