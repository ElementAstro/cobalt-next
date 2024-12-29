"use client";

import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="max-h-screen bg-gray-900 text-black w-full h-full">
      {children}
    </div>
  );
};

export default Layout;
