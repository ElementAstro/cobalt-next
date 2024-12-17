import React, { useEffect, useRef } from "react";
import Script from "next/script";

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

const Aladin: React.FC<AladinProps> = ({
  ra,
  dec,
  fov,
  onCenterChange,
  fov_points,
  fov_size,
}) => {
  const alaRef = useRef<HTMLDivElement>(null);
  const aladinInstance = useRef<any>(null);

  useEffect(() => {
    if (window.A) {
      aladinInstance.current = window.A.aladin(alaRef.current, {
        fov: fov,
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
        showFrame: false, // false in development,
        cooframe: "equatorial",
        showSimbadPointrerControl: false,
      });

      aladinInstance.current.gotoRaDec(ra, dec);

      if (onCenterChange) {
        aladinInstance.current.on("zoomChanged", () => {
          const center = aladinInstance.current.getRaDec();
          onCenterChange(center[0], center[1]);
        });

        aladinInstance.current.on("positionChanged", () => {
          const center = aladinInstance.current.getRaDec();
          onCenterChange(center[0], center[1]);
        });
      }

      if (fov_points) {
        fov_points.forEach((points) => {
          aladinInstance.current.addFootprints(window.A.polygon(points));
        });
      }
    }
  }, [ra, dec, fov, onCenterChange, fov_points]);

  useEffect(() => {
    if (aladinInstance.current) {
      aladinInstance.current.gotoRaDec(ra, dec);
    }
  }, [ra, dec]);

  useEffect(() => {
    if (aladinInstance.current && fov_size) {
      aladinInstance.current.setFoV(fov_size);
    }
  }, [fov_size]);

  return (
    <>
      <Script
        src="https://aladin.u-strasbg.fr/AladinLite/api/v3/latest/aladin.js"
        strategy="beforeInteractive"
      />
      <div ref={alaRef} style={{ width: "100%", height: "100%" }}></div>
    </>
  );
};

export default Aladin;
