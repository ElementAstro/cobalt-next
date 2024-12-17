"use client";

import React, { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // 锁定横屏
    if (screen.orientation && (screen.orientation as any).lock) {
      (screen.orientation as any).lock("landscape").catch((err: Error) => {
        console.log("横屏锁定失败:", err);
      });
    }

    // 禁用双指缩放
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-black w-full h-full orientation-landscape">
      {children}
    </div>
  );
};

export default Layout;
