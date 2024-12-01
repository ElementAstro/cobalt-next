"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircleQuestionIcon as QuestionMarkCircle,
  Upload,
  Send,
  RotateCw,
  Download,
} from "lucide-react";
import Image from "next/image";

export default function PlateSolverSettings() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSendToAstrometry = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    // Simulating API call to Astrometry.net
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(
        "RA: 12h 34m 56.7s, Dec: +12° 34' 56.7\", Field size: 1.23 x 1.23 degrees"
      );
      toast({
        title: "Analysis Complete",
        description: "Image successfully analyzed by Astrometry.net",
      });
    }, 3000);
  };

  const handleRotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownloadResult = () => {
    if (analysisResult) {
      const blob = new Blob([analysisResult], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "astrometry_result.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${
        isLandscape ? "lg:flex lg:space-x-6 lg:space-y-0" : ""
      }`}
    >
      <Tabs
        defaultValue="settings"
        className={`w-full ${isLandscape ? "lg:w-1/2" : ""}`}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="image-upload">Image Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <Card>
            <CardContent className="space-y-6">
              <ScrollArea className="max-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="plate-solver">Plate solver</Label>
                    <Select defaultValue="ASTAP">
                      <SelectTrigger id="plate-solver">
                        <SelectValue placeholder="Select solver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASTAP">ASTAP</SelectItem>
                        <SelectItem value="Platesolve2">Platesolve2</SelectItem>
                        <SelectItem value="Platesolve3">Platesolve3</SelectItem>
                        <SelectItem value="AllSkyPlateSolver">
                          All Sky Plate Solver
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blind-solver">Blind solver</Label>
                    <Select defaultValue="ASTAP">
                      <SelectTrigger id="blind-solver">
                        <SelectValue placeholder="Select solver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASTAP">ASTAP</SelectItem>
                        <SelectItem value="Platesolve2">Platesolve2</SelectItem>
                        <SelectItem value="Platesolve3">Platesolve3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="blind-solver-failures">
                      Use Blind Solver for Failures
                    </Label>
                    <Switch id="blind-solver-failures" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exposure-time">Exposure time</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        id="exposure-time"
                        defaultValue={2}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">s</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter">Filter</Label>
                    <Select defaultValue="current">
                      <SelectTrigger id="filter">
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">(Current)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="binning">Binning</Label>
                    <Input
                      type="number"
                      id="binning"
                      defaultValue={1}
                      className="w-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pointing-tolerance">
                      Pointing tolerance
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        id="pointing-tolerance"
                        defaultValue={1}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">
                        arcmin
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rotation-tolerance">
                      Rotation tolerance
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        id="rotation-tolerance"
                        defaultValue={1}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">°</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attempts">Number of attempts</Label>
                    <Input
                      type="number"
                      id="attempts"
                      defaultValue={10}
                      className="w-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delay">Delay between attempts</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        id="delay"
                        defaultValue={2}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">min</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Astrometry.net Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="api-key">API key</Label>
                  <Button variant="ghost" size="icon" className="h-4 w-4">
                    <QuestionMarkCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Input id="api-key" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" defaultValue="http://nova.astrometry.net" />
              </div>

              <div className="space-y-2">
                <Label>Plate solve service provided by</Label>
                <div className="mt-2">
                  <Image
                    src="/placeholder.svg?height=50&width=200"
                    alt="Astrometry.net logo"
                    width={200}
                    height={50}
                    className="dark:invert"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="image-upload">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload and Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
              </div>
              {selectedImage && (
                <div className="space-y-4">
                  <Label>Image Preview</Label>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={selectedImage}
                      alt="Uploaded image preview"
                      layout="fill"
                      objectFit="contain"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Button onClick={handleRotateImage}>
                      <RotateCw className="mr-2 h-4 w-4" /> Rotate Image
                    </Button>
                    <div className="w-1/2">
                      <Label htmlFor="brightness">Brightness</Label>
                      <Slider
                        id="brightness"
                        min={0}
                        max={200}
                        defaultValue={[100]}
                        step={1}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSendToAstrometry}
                    className="w-full"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>Analyzing...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send to Astrometry.net
                      </>
                    )}
                  </Button>
                </div>
              )}
              {analysisResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{analysisResult}</p>
                    <Button onClick={handleDownloadResult}>
                      <Download className="mr-2 h-4 w-4" /> Download Result
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {isLandscape && selectedImage && (
        <div className="lg:w-1/2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedImage}
                  alt="Uploaded image preview"
                  layout="fill"
                  objectFit="contain"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Button onClick={handleRotateImage}>
                  <RotateCw className="mr-2 h-4 w-4" /> Rotate Image
                </Button>
                <div className="w-1/2">
                  <Label htmlFor="brightness-landscape">Brightness</Label>
                  <Slider
                    id="brightness-landscape"
                    min={0}
                    max={200}
                    defaultValue={[100]}
                    step={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{analysisResult}</p>
                <Button onClick={handleDownloadResult}>
                  <Download className="mr-2 h-4 w-4" /> Download Result
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
}
