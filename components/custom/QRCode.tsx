import React, { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Download, AlertCircle } from "lucide-react";

interface QRCodeProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  iconBackgroundColor?: string;
  iconBorderRadius?: number;
  iconSize?: number;
  iconSrc?: string;
  padding?: number | string;
  type?: "canvas" | "svg";
  theme?: "light" | "dark";
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  backgroundColor = "#FFF",
  color = "#000",
  errorCorrectionLevel = "M",
  iconBackgroundColor = "#FFF",
  iconBorderRadius = 4,
  iconSize = 40,
  iconSrc,
  padding = 12,
  type = "canvas",
  theme = "light",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsGenerated(false);
        setError("");
        if (type === "canvas") {
          const canvas = canvasRef.current;
          if (canvas) {
            await QRCodeLib.toCanvas(canvas, value, {
              width: size,
              margin: Number(padding),
              color: {
                dark: color,
                light: backgroundColor,
              },
              errorCorrectionLevel:
                errorCorrectionLevel as QRCodeLib.QRCodeErrorCorrectionLevel,
            });
          }
        } else {
          const svgString = await QRCodeLib.toString(value, {
            type: "svg",
            width: size,
            margin: Number(padding),
            color: {
              dark: color,
              light: backgroundColor,
            },
            errorCorrectionLevel:
              errorCorrectionLevel as QRCodeLib.QRCodeErrorCorrectionLevel,
          });
          setQrCodeData(svgString);
        }
        setIsGenerated(true);
      } catch (error) {
        console.error("生成二维码时出错:", error);
        setError("生成二维码失败，请检查输入值或网络连接。");
      }
    };

    generateQRCode();
  }, [
    value,
    size,
    backgroundColor,
    color,
    errorCorrectionLevel,
    padding,
    type,
  ]);

  useEffect(() => {
    if (iconSrc && isGenerated && (canvasRef.current || svgRef.current)) {
      const img = new Image();
      img.onload = () => {
        const element = type === "canvas" ? canvasRef.current : svgRef.current;
        if (element) {
          const context = (element as HTMLCanvasElement).getContext("2d");
          if (context && type === "canvas") {
            const iconX = (size - iconSize) / 2;
            const iconY = (size - iconSize) / 2;

            context.fillStyle = iconBackgroundColor;
            context.beginPath();
            context.roundRect(
              iconX,
              iconY,
              iconSize,
              iconSize,
              iconBorderRadius
            );
            context.fill();

            context.drawImage(img, iconX, iconY, iconSize, iconSize);
          }
        }
      };
      img.src = iconSrc;
    }
  }, [
    iconSrc,
    size,
    iconSize,
    iconBackgroundColor,
    iconBorderRadius,
    type,
    isGenerated,
  ]);

  const downloadQRCode = () => {
    const element = type === "canvas" ? canvasRef.current : svgRef.current;
    if (element) {
      const dataUrl =
        type === "canvas"
          ? (element as HTMLCanvasElement).toDataURL("image/png")
          : "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(qrCodeData);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = type === "canvas" ? "qrcode.png" : "qrcode.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`qr-code-container ${currentTheme} p-4 rounded-lg shadow-lg flex flex-col items-center space-y-4`}
      style={{
        width: size + 40,
        backgroundColor: currentTheme === "light" ? "#f9f9f9" : "#1a202c",
      }}
    >
      <div className="w-full flex justify-end">
        <Switch
          checked={currentTheme === "dark"}
          onCheckedChange={toggleTheme}
        />
        {currentTheme === "dark" ? (
          <Moon className="ml-2" />
        ) : (
          <Sun className="ml-2" />
        )}
      </div>
      <AnimatePresence>
        {isGenerated && (
          <motion.div
            key="qrcode"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {type === "canvas" ? (
              <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="rounded-md"
              />
            ) : (
              <div
                ref={svgRef}
                dangerouslySetInnerHTML={{ __html: qrCodeData }}
                className="rounded-md"
              />
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 left-0 bg-red-500 text-white p-2 rounded-md flex items-center"
              >
                <AlertCircle className="mr-2" />
                {error}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="download-button flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={downloadQRCode}
      >
        <Download />
        <span>下载二维码</span>
      </motion.button>
    </motion.div>
  );
};

export default QRCode;
