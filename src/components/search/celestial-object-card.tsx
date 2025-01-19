import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Maximize2,
  Move,
  Star,
  Share2,
  Info,
  Settings,
  Eye,
  MapPin,
  Clock,
  Compass,
  Telescope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RiseSetChart } from "./riseset-chart";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import useSearchStore from "@/store/useSearchStore";

interface CelestialObjectProps {
  id: string;
  name: string;
  type: string;
  constellation: string;
  rightAscension: string;
  declination: string;
  magnitude: number;
  size: number;
  distance: number;
  riseTime: string;
  setTime: string;
  transitTime: string;
  transitAltitude: number;
  thumbnail: string | null;
  isLoggedIn: boolean;
  className?: string;
  cardStyle?: "default" | "compact" | "detailed";
  animationType?: "fade" | "slide" | "zoom";
  showAdvancedInfo?: boolean;
}

export function CelestialObjectCard({
  id,
  className,
  cardStyle = "default",
  animationType = "fade",
  showAdvancedInfo = false,
  ...props
}: CelestialObjectProps) {
  const { favorites, toggleFavorite } = useSearchStore();
  const isFavorite = favorites.includes(id);
  const controls = useAnimationControls();
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleButtonHover = async (buttonType: string) => {
    await controls.start({
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 },
    });

    switch (buttonType) {
      case "favorite":
        await controls.start({
          rotate: isFavorite ? [0, -10, 10, 0] : [0, 10, -10, 0],
          transition: { duration: 0.4 },
        });
        break;
      case "share":
        await controls.start({
          rotate: [0, 10, -10, 0],
          transition: { duration: 0.3 },
        });
        break;
      case "info":
        await controls.start({
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.2 },
        });
        break;
      default:
        await controls.start({
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.2 },
        });
    }
  };

  const handleFavoriteClick = () => {
    toggleFavorite(id);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: props.name,
        text: `查看天体对象：${props.name}`,
        url: `/celestial-object/${id}`,
      });
    } catch (err) {
      console.log("分享失败");
    }
  };

  return (
    <motion.div
      initial={
        animationType === "fade"
          ? { opacity: 0, y: 20 }
          : animationType === "slide"
          ? { x: -50, opacity: 0 }
          : { scale: 0.9, opacity: 0 }
      }
      animate={
        animationType === "fade"
          ? { opacity: 1, y: 0 }
          : animationType === "slide"
          ? { x: 0, opacity: 1 }
          : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={cn("w-full p-2", className)}
    >
      <Card
        className={cn(
          "w-full p-2 shadow-lg rounded-lg transition-all duration-300",
          {
            "max-w-md": cardStyle === "compact",
            "max-w-2xl": cardStyle === "detailed",
            "bg-white": !isDarkMode,
            "bg-gray-800": isDarkMode,
            "border border-gray-200": !isDarkMode,
            "border border-gray-700": isDarkMode,
          }
        )}
      >
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4">
            <div className="flex items-center justify-center">
              {props.thumbnail ? (
                <Image
                  src={props.thumbnail}
                  alt={props.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div
              className={cn("space-y-2", {
                "space-y-4": cardStyle === "detailed",
              })}
            >
              <div className="flex items-center justify-between">
                <Link href={`/celestial-object/${id}`}>
                  <h3 className="text-lg font-semibold hover:underline text-gray-900 dark:text-white">
                    {props.name}
                  </h3>
                </Link>
                <span className="text-sm text-muted-foreground">
                  {props.type}
                </span>
              </div>
              <div
                className={cn("grid gap-2 text-sm", {
                  "grid-cols-2": cardStyle !== "detailed",
                  "grid-cols-3": cardStyle === "detailed",
                })}
              >
                <div>
                  <p className="text-muted-foreground">RA</p>
                  <p>{props.rightAscension}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dec</p>
                  <p>{props.declination}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Constellation</p>
                  <p>{props.constellation}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Magnitude</p>
                  <p>{props.magnitude}</p>
                </div>
              </div>
              {cardStyle !== "compact" && (
                <RiseSetChart
                  riseTime={props.riseTime}
                  setTime={props.setTime}
                  transitTime={props.transitTime}
                  transitAltitude={props.transitAltitude}
                />
              )}

              {showAdvancedInfo && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Coordinates</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">
                      RA: {props.rightAscension}, Dec: {props.declination}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Observation Times</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">
                      Rise: {props.riseTime}, Set: {props.setTime}, Transit:{" "}
                      {props.transitTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>Position</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">
                      Altitude: {props.transitAltitude}°
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Telescope className="w-4 h-4" />
                    <span>Visibility</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm">
                      Magnitude: {props.magnitude}, Size: {props.size} arcmin
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              className={cn("flex flex-col gap-2", {
                "justify-center": cardStyle === "compact",
              })}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => handleButtonHover("target")}
              >
                <Button
                  className="w-full"
                  variant={isDarkMode ? "secondary" : "default"}
                  onClick={() => console.log("Target added")}
                >
                  <motion.div animate={controls} whileHover={{ rotate: 10 }}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                  </motion.div>
                  Add target
                </Button>
              </motion.div>
              {cardStyle === "detailed" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => handleButtonHover("settings")}
                >
                  <Button
                    className="w-full"
                    variant={isDarkMode ? "ghost" : "outline"}
                    onClick={() => console.log("Settings opened")}
                  >
                    <motion.div animate={controls} whileHover={{ rotate: 10 }}>
                      <Settings className="w-4 h-4 mr-2" />
                    </motion.div>
                    Observation Settings
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => handleButtonHover("framing")}
              >
                <Button
                  className="w-full"
                  variant={isDarkMode ? "ghost" : "outline"}
                  onClick={() => console.log("Framing set")}
                >
                  <motion.div animate={controls} whileHover={{ rotate: 10 }}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                  </motion.div>
                  Set framing
                </Button>
              </motion.div>
              {cardStyle === "detailed" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => handleButtonHover("preview")}
                >
                  <Button
                    className="w-full"
                    variant={isDarkMode ? "ghost" : "outline"}
                    onClick={() => console.log("Preview opened")}
                  >
                    <motion.div animate={controls} whileHover={{ rotate: 10 }}>
                      <Eye className="w-4 h-4 mr-2" />
                    </motion.div>
                    Preview Observation
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => handleButtonHover("slew")}
              >
                <Button
                  className="w-full"
                  variant={isDarkMode ? "ghost" : "outline"}
                >
                  <motion.div animate={controls} whileHover={{ rotate: 10 }}>
                    <Move className="w-4 h-4 mr-2" />
                  </motion.div>
                  Slew
                </Button>
              </motion.div>
              {props.isLoggedIn && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => handleButtonHover("favorite")}
                >
                  <Button
                    className="w-full mt-2"
                    variant={isDarkMode ? "ghost" : "outline"}
                    onClick={handleFavoriteClick}
                  >
                    <motion.div
                      animate={controls}
                      whileHover={{ rotate: isFavorite ? -10 : 10 }}
                    >
                      <Star
                        className={`w-4 h-4 mr-2 ${
                          isFavorite ? "fill-yellow-400" : ""
                        }`}
                      />
                    </motion.div>
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => handleButtonHover("share")}
              >
                <Button
                  className="w-full"
                  variant={isDarkMode ? "ghost" : "outline"}
                  onClick={handleShare}
                >
                  <motion.div animate={controls} whileHover={{ rotate: 10 }}>
                    <Share2 className="w-4 h-4 mr-2" />
                  </motion.div>
                  分享
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => handleButtonHover("info")}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant={isDarkMode ? "ghost" : "outline"}
                    >
                      <motion.div
                        animate={controls}
                        whileHover={{ rotate: 10 }}
                      >
                        <Info className="w-4 h-4 mr-2" />
                      </motion.div>
                      详细信息
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{props.name} - 详细信息</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">大小</h4>
                        <p>{props.size} 角分</p>
                      </div>
                      <div>
                        <h4 className="font-medium">距离</h4>
                        <p>{props.distance} 光年</p>
                      </div>
                      {/* 添加更多详细信息 */}
                    </div>
                    <DialogClose asChild>
                      <Button variant="outline" className="mt-4">
                        关闭
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
