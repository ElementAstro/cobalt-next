import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Maximize2, Move, Star, Share2, Info } from "lucide-react";
import { RiseSetChart } from "./riseset-chart";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
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
}

export function CelestialObjectCard({ id, ...props }: CelestialObjectProps) {
  const { favorites, toggleFavorite } = useSearchStore();
  const isFavorite = favorites.includes(id);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-2"
    >
      <Card className="w-full p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
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
            <div className="space-y-2">
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
              <div className="grid grid-cols-2 gap-2 text-sm">
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
              <RiseSetChart
                riseTime={props.riseTime}
                setTime={props.setTime}
                transitTime={props.transitTime}
                transitAltitude={props.transitAltitude}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" variant="default">
                <Maximize2 className="w-4 h-4 mr-2" />
                Add target
              </Button>
              <Button className="w-full" variant="outline">
                <Lightbulb className="w-4 h-4 mr-2" />
                Set framing
              </Button>
              <Button className="w-full" variant="outline">
                <Move className="w-4 h-4 mr-2" />
                Slew
              </Button>
              {props.isLoggedIn && (
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={handleFavoriteClick}
                >
                  <Star
                    className={`w-4 h-4 mr-2 ${
                      isFavorite ? "fill-yellow-400" : ""
                    }`}
                  />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              )}
              <Button
                className="w-full"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Info className="w-4 h-4 mr-2" />
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
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
