"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Navigation, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface GeocodingResult {
  status: string;
  info: string;
  geocodes?: Array<{
    location: string;
    formatted_address: string;
    country: string;
    province: string;
    city: string;
    district: string;
    township: string;
  }>;
  regeocode?: {
    formatted_address: string;
    addressComponent: {
      country: string;
      province: string;
      city: string;
      district: string;
      township: string;
    };
  };
}

export default function GeocodingComponent() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<GeocodingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [copiedCoordinates, setCopiedCoordinates] = useState<string | null>(
    null
  );

  const API_KEY = process.env.NEXT_PUBLIC_AMAP_KEY;
  const BASE_URL = "https://restapi.amap.com/v3/geocode";

  async function geocode(address: string) {
    const url = `${BASE_URL}/geo?key=${API_KEY}&address=${encodeURIComponent(
      address
    )}`;
    const response = await fetch(url);
    return response.json();
  }

  async function reverseGeocode(location: string) {
    const url = `${BASE_URL}/regeo?key=${API_KEY}&location=${location}&extensions=all`;
    const response = await fetch(url);
    return response.json();
  }

  function getStaticMapUrl(
    location: string,
    zoom: number = 14,
    width: number = 400,
    height: number = 200
  ) {
    return `https://restapi.amap.com/v3/staticmap?location=${location}&zoom=${zoom}&size=${width}*${height}&markers=mid,,A:${location}&key=${API_KEY}`;
  }

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveRecentSearch = (search: string) => {
    const updatedSearches = [
      search,
      ...recentSearches.filter((s) => s !== search).slice(0, 4),
    ];
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  const validateAndFormatCoordinates = (input: string): string | null => {
    const coordsRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = input.match(coordsRegex);
    if (match) {
      const [, lng, , lat] = match;
      return `${parseFloat(lng).toFixed(6)},${parseFloat(lat).toFixed(6)}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("请输入地址或坐标");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let data;
      if (isReverseGeocoding) {
        const formattedCoords = validateAndFormatCoordinates(input);
        if (!formattedCoords) {
          throw new Error('无效的坐标格式。请使用"经度,纬度"格式。');
        }
        data = await reverseGeocode(formattedCoords);
      } else {
        data = await geocode(input);
      }

      if (data.status === "0") {
        throw new Error(data.info || "请求失败");
      }

      setResult(data);
      saveRecentSearch(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取数据时发生错误");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCoordinates(text);
      setTimeout(() => setCopiedCoordinates(null), 2000);
    });
  };

  const renderMapPreview = (location: string) => {
    const [lng, lat] = location.split(",");
    const mapUrl = `https://restapi.amap.com/v3/staticmap?location=${lng},${lat}&zoom=14&size=400*200&markers=mid,,A:${lng},${lat}&key=${process.env.NEXT_PUBLIC_AMAP_KEY}`;
    return (
      <div className="mt-4">
        <img
          src={mapUrl}
          alt="Location Map"
          className="w-full rounded-md shadow-md"
        />
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.geocodes) {
      // 地理编码结果
      return result.geocodes.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="mt-4 bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                位置信息
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div>
                  <span className="font-medium">完整地址：</span>
                  {item.formatted_address}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">坐标：</span>
                  {item.location}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(item.location)}
                  >
                    {copiedCoordinates === item.location ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">省份：</span>
                  {item.province}
                </div>
                <div>
                  <span className="font-medium">城市：</span>
                  {item.city}
                </div>
                <div>
                  <span className="font-medium">区县：</span>
                  {item.district}
                </div>
                <div>
                  <span className="font-medium">街道：</span>
                  {item.township}
                </div>
              </div>
              {renderMapPreview(item.location)}
            </CardContent>
          </Card>
        </motion.div>
      ));
    }

    if (result.regeocode) {
      // 逆地理编码结果
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mt-4 bg-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                地址信息
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <span className="font-medium">完整地址：</span>
                {result.regeocode.formatted_address}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">省份：</span>
                  {result.regeocode.addressComponent.province}
                </div>
                <div>
                  <span className="font-medium">城市：</span>
                  {result.regeocode.addressComponent.city}
                </div>
                <div>
                  <span className="font-medium">区县：</span>
                  {result.regeocode.addressComponent.district}
                </div>
                <div>
                  <span className="font-medium">街道：</span>
                  {result.regeocode.addressComponent.township}
                </div>
              </div>
              {renderMapPreview(input)}
            </CardContent>
          </Card>
        </motion.div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-4"
    >
      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle>地理编码 / 逆地理编码</CardTitle>
          <CardDescription>
            输入地址获取坐标，或输入坐标获取地址信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">搜索</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2"
                >
                  <Toggle
                    pressed={isReverseGeocoding}
                    onPressedChange={setIsReverseGeocoding}
                  >
                    {isReverseGeocoding ? "逆地理编码" : "地理编码"}
                  </Toggle>
                  <Input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                      isReverseGeocoding ? "输入坐标 (经度,纬度)" : "输入地址"
                    }
                    className="flex-grow bg-gray-800 text-white"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      "查询"
                    )}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
            <TabsContent value="history">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-gray-800">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-white"
                    onClick={() => {
                      setInput(search);
                      setIsReverseGeocoding(
                        validateAndFormatCoordinates(search) !== null
                      );
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {renderResult()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
