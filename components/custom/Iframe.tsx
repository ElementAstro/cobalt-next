"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

interface CustomIframeProps {
  src: string;
  title: string;
  width?: string | number;
  height?: string | number;
  allowFullScreen?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  timeout?: number;
  lazy?: boolean;
  mobileHeight?: string | number;
  desktopHeight?: string | number;
  customStyles?: React.CSSProperties;
  sandboxAttributes?: string;
  allowScripts?: boolean;
  refreshInterval?: number;
  onMessage?: (event: MessageEvent) => void;
}

export const CustomIframe: React.FC<CustomIframeProps> = ({
  src,
  title,
  width = "100%",
  height,
  allowFullScreen = false,
  className = "",
  onLoad,
  onError,
  loadingComponent,
  errorComponent,
  timeout = 10000,
  lazy = false,
  mobileHeight = "300px",
  desktopHeight = "500px",
  customStyles = {},
  sandboxAttributes = "",
  allowScripts = false,
  refreshInterval,
  onMessage,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldRender, setShouldRender] = useState(!lazy);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const currentHeight = isMobile ? mobileHeight : height || desktopHeight;

  useEffect(() => {
    if (lazy) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" }
      );

      if (wrapperRef.current) {
        observer.observe(wrapperRef.current);
      }
      return () => observer.disconnect();
    }
  }, [lazy]);

  useEffect(() => {
    if (shouldRender) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isLoading, onError, shouldRender, timeout]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, src]);

  useEffect(() => {
    if (onMessage) {
      const handleMessage = (event: MessageEvent) => {
        if (event.source === iframeRef.current?.contentWindow) {
          onMessage(event);
        }
      };

      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [onMessage]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const sandboxProps = allowScripts
    ? { sandbox: `allow-scripts ${sandboxAttributes}`.trim() }
    : sandboxAttributes
    ? { sandbox: sandboxAttributes }
    : {};

  return (
    <div
      ref={wrapperRef}
      id="custom-iframe-wrapper"
      className={`custom-iframe-wrapper relative ${className}`}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-indicator absolute inset-0 flex items-center justify-center bg-gray-100"
          >
            {loadingComponent || <p>Loading...</p>}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="error-message absolute inset-0 flex items-center justify-center bg-red-100"
          >
            {errorComponent || (
              <p>Failed to load iframe content. Please try again later.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {shouldRender && (
        <>
          <motion.iframe
            ref={iframeRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: isLoading ? 0 : 1,
              scale: isLoading ? 0.95 : 1,
            }}
            transition={{ duration: 0.3 }}
            src={src}
            title={title}
            width={width}
            height={currentHeight}
            allowFullScreen={allowFullScreen}
            onLoad={handleLoad}
            onError={handleError}
            style={{ border: "none", ...customStyles }}
            {...sandboxProps}
          />
          {allowFullScreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          )}
        </>
      )}
    </div>
  );
};
