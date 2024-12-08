'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZoomIn, ZoomOut, Move, Maximize, Grid, RotateCcw, Plus, Minus, Globe, ImageIcon, FileImage, Map, Settings, Share2, Layers, Search, Crosshair, Expand, Camera, RotateCw, Star } from 'lucide-react'
import type { StarMapConfig, StarMapProps } from '../types/star-map'

declare global {
  interface Window {
    A: any // AladinLite type
  }
}

const DEFAULT_CONFIG: StarMapConfig = {
  imageSource: 'P/DSS2/color',
  coordinates: {
    ra: '0',
    dec: '0',
  },
  fieldOfView: 360,
  projection: 'AIT',
  cooFrame: 'equatorial',
  reticleColor: '#ff0000',
  reticleSize: 22,
  showReticle: true,
  showCooGrid: true,
  showCooGridControl: true,
  showSimbadPointerControl: true,
  showFullscreenControl: true,
  showLayersControl: true,
  showGotoControl: true,
  showShareControl: true,
  showCatalog: true,
  camera: {
    width: 800,
    height: 600,
    pixelSize: 3.8,
    focalLength: 100,
  },
  targets: {
    horizontalPanels: 1,
    verticalPanels: 1,
    rotation: 0,
  },
  cameraFovOverlay: {
    show: false,
    color: '#00ff00',
    opacity: 0.3,
  },
  constellations: {
    show: false,
    names: false,
    boundaries: false,
  },
  fov: {
    width: 2.5,
    height: 1.8,
    rotation: 0,
    color: '#ffffff',
    show: false,
  },
}

export function StarMap({ initialConfig = {}, onConfigChange }: StarMapProps) {
  const [config, setConfig] = useState<StarMapConfig>({ ...DEFAULT_CONFIG, ...initialConfig })
  const [aladin, setAladin] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraFovOverlayRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || aladin) return

    const script = document.createElement('script')
    script.src = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js'
    script.async = true
    script.onload = () => {
      window.A.init.then(() => {
        const aladinInstance = window.A.aladin('#aladin-lite-div', {
          survey: config.imageSource,
          fov: config.fieldOfView,
          target: `${config.coordinates.ra} ${config.coordinates.dec}`,
          projection: config.projection,
          cooFrame: config.cooFrame,
          reticleColor: config.reticleColor,
          reticleSize: config.reticleSize,
          showReticle: config.showReticle,
          showCooGrid: config.showCooGrid,
          showCooGridControl: config.showCooGridControl,
          showSimbadPointerControl: config.showSimbadPointerControl,
          showFullscreenControl: config.showFullscreenControl,
          showLayersControl: config.showLayersControl,
          showGotoControl: config.showGotoControl,
          showShareControl: config.showShareControl,
          showCatalog: config.showCatalog,
        })
        setAladin(aladinInstance)

        // Set up event listener for coordinate changes
        aladinInstance.on('positionChanged', (lon: number, lat: number) => {
          updateConfig({
            coordinates: {
              ra: lon.toString(),
              dec: lat.toString(),
            },
          })
        })

        // Initialize camera FOV overlay
        const overlay = window.A.graphicOverlay({color: config.cameraFovOverlay.color, lineWidth: 2});
        aladinInstance.addOverlay(overlay);
        cameraFovOverlayRef.current = overlay;
        updateCameraFovOverlay();

        // Initialize FOV overlay
        const fovOverlay = window.A.graphicOverlay({color: config.fov.color, lineWidth: 2});
        aladinInstance.addOverlay(fovOverlay);
        updateFovOverlay(fovOverlay);

        // Initialize constellations
        updateConstellations();
      })
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const updateConfig = (updates: Partial<StarMapConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates }
      onConfigChange?.(newConfig)
      return newConfig
    })
  }

  const handleCoordinateChange = (type: 'ra' | 'dec', value: string) => {
    updateConfig({
      coordinates: {
        ...config.coordinates,
        [type]: value,
      },
    })
    if (aladin) {
      aladin.gotoRaDec(config.coordinates.ra, config.coordinates.dec)
    }
  }

  const handleZoom = (direction: 'in' | 'out') => {
    if (!aladin) return
    const factor = direction === 'in' ? 0.5 : 2
    const newFov = config.fieldOfView * factor
    aladin.setFov(newFov)
    updateConfig({ fieldOfView: newFov })
  }

  const handleProjectionChange = (value: string) => {
    updateConfig({ projection: value })
    if (aladin) {
      aladin.setProjection(value)
    }
  }

  const handleCooFrameChange = (value: string) => {
    updateConfig({ cooFrame: value })
    if (aladin) {
      aladin.setFrame(value)
    }
  }

  const handleToggleControl = (key: keyof StarMapConfig) => {
    const newValue = !config[key]
    updateConfig({ [key]: newValue })
    if (aladin) {
      switch (key) {
        case 'showCooGrid':
          aladin.showGrid(newValue)
          break
        case 'showCooGridControl':
          aladin.showGridControl(newValue)
          break
        case 'showSimbadPointerControl':
          aladin.showSimbadPointerControl(newValue)
          break
        case 'showFullscreenControl':
          aladin.showFullscreenControl(newValue)
          break
        case 'showLayersControl':
          aladin.showLayersControl(newValue)
          break
        case 'showGotoControl':
          aladin.showGotoControl(newValue)
          break
        case 'showShareControl':
          aladin.showShareControl(newValue)
          break
        case 'showCatalog':
          aladin.showCatalog(newValue)
          break
        case 'showReticle':
          aladin.showReticle(newValue)
          break
      }
    }
  }

  const calcFov = (width: number, height: number, pixelSize: number, focalLength: number) => {
    const fovWidth = 0.016666666666667 * Math.round(3438 * Math.atan(width / focalLength));
    const fovHeight = 0.016666666666667 * Math.round(3438 * Math.atan(height / focalLength));
    const resolution = Math.round(100 * Math.atan(pixelSize / focalLength) * 206.265) / 100;
    return [fovWidth, fovHeight, resolution];
  };

  const updateFovOverlay = (overlay: any) => {
    if (!aladin || !overlay) return;

    const { width, height, pixelSize, focalLength } = config.camera;
    const [fovWidth, fovHeight] = calcFov(width * pixelSize / 1000, height * pixelSize / 1000, pixelSize, focalLength);

    const ra = parseFloat(config.coordinates.ra);
    const dec = parseFloat(config.coordinates.dec);
    const rotation = config.fov.rotation * (Math.PI / 180);

    overlay.removeAll();

    if (config.fov.show) {
      const fov = window.A.circle(ra, dec, fovWidth / 2);
      fov.setColor(config.fov.color);
      overlay.add(fov);

      // Add FOV direction indicator
      const indicatorLength = fovWidth / 4;
      const endRa = ra + indicatorLength * Math.cos(rotation);
      const endDec = dec + indicatorLength * Math.sin(rotation);
      const line = window.A.polyline([[ra, dec], [endRa, endDec]]);
      line.setColor(config.fov.color);
      overlay.add(line);
    }
  };

  const updateCameraFovOverlay = () => {
    if (!aladin || !cameraFovOverlayRef.current) return;

    const { width, height, pixelSize, focalLength } = config.camera;
    if (!focalLength) return;

    const fovWidth = (width * pixelSize / focalLength) * (180 / Math.PI);
    const fovHeight = (height * pixelSize / focalLength) * (180 / Math.PI);

    const ra = parseFloat(config.coordinates.ra);
    const dec = parseFloat(config.coordinates.dec);

    const rotation = config.targets.rotation * (Math.PI / 180);

    cameraFovOverlayRef.current.removeAll();

    if (config.cameraFovOverlay.show) {
      const { horizontalPanels, verticalPanels } = config.targets;
      
      for (let i = 0; i < horizontalPanels; i++) {
        for (let j = 0; j < verticalPanels; j++) {
          const panelRa = ra + (i - (horizontalPanels - 1) / 2) * fovWidth;
          const panelDec = dec + (j - (verticalPanels - 1) / 2) * fovHeight;

          const corners = [
            [panelRa - fovWidth/2, panelDec - fovHeight/2],
            [panelRa + fovWidth/2, panelDec - fovHeight/2],
            [panelRa + fovWidth/2, panelDec + fovHeight/2],
            [panelRa - fovWidth/2, panelDec + fovHeight/2]
          ];

          // Apply rotation
          const rotatedCorners = corners.map(([x, y]) => {
            const dx = x - ra;
            const dy = y - dec;
            const rotatedX = dx * Math.cos(rotation) - dy * Math.sin(rotation) + ra;
            const rotatedY = dx * Math.sin(rotation) + dy * Math.cos(rotation) + dec;
            return [rotatedX, rotatedY];
          });

          const polygon = window.A.polygon(rotatedCorners);
          polygon.setColor(config.cameraFovOverlay.color);
          polygon.setOpacity(config.cameraFovOverlay.opacity);
          cameraFovOverlayRef.current.add(polygon);
        }
      }
    }
  };

  const updateConstellations = () => {
    if (!aladin) return;

    aladin.showConstellationLines(config.constellations.show);
    aladin.showConstellationLabels(config.constellations.names);
    aladin.showConstellationBoundaries(config.constellations.boundaries);
  }

  useEffect(() => {
    updateCameraFovOverlay();
  }, [config.camera, config.coordinates, config.targets.rotation, config.cameraFovOverlay]);

  useEffect(() => {
    if (aladin) {
      const overlay = aladin.getOverlays()[0];
      updateFovOverlay(overlay);
    }
  }, [config.camera, config.coordinates, config.fov, aladin]);

  useEffect(() => {
    updateConstellations();
  }, [config.constellations]);

  useEffect(() => {
    if (!aladin) return;

    const handlePositionChange = (lon: number, lat: number) => {
      updateConfig({
        coordinates: {
          ra: lon.toString(),
          dec: lat.toString(),
        },
      });
      updateFovOverlay(aladin.getOverlays()[0]);
      updateCameraFovOverlay();
    };

    aladin.on('positionChanged', handlePositionChange);

    return () => {
      if (aladin && aladin.removeListener) {
        aladin.removeListener('positionChanged', handlePositionChange);
      }
    };
  }, [aladin]);

  useEffect(() => {
    if (!aladin) return;

    const handleZoomChange = () => {
      updateFovOverlay(aladin.getOverlays()[0]);
      updateCameraFovOverlay();
    };

    aladin.on('zoomChanged', handleZoomChange);

    return () => {
      if (aladin && aladin.removeListener) {
        aladin.removeListener('zoomChanged', handleZoomChange);
      }
    };
  }, [aladin]);


  return (
    <div className="grid lg:grid-cols-[350px,1fr] gap-4 p-4 h-[calc(100vh-2rem)]">
      <Card className="p-4 space-y-6 overflow-y-auto">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Image source</h2>
              <Select
                value={config.imageSource}
                onValueChange={(value) => {
                  updateConfig({ imageSource: value })
                  if (aladin) aladin.setImageSurvey(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select image source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P/DSS2/color">DSS colored</SelectItem>
                  <SelectItem value="P/allWISE/color">AllWISE color</SelectItem>
                  <SelectItem value="P/PanSTARRS/DR1/color-z-zg-g">PanSTARRS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Coordinates</h2>
              <div className="grid gap-2">
                <Label htmlFor="ra">RA</Label>
                <Input
                  id="ra"
                  value={config.coordinates.ra}
                  onChange={(e) => handleCoordinateChange('ra', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dec">Dec</Label>
                <Input
                  id="dec"
                  value={config.coordinates.dec}
                  onChange={(e) => handleCoordinateChange('dec', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Field of view</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleZoom('in')}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={config.fieldOfView.toFixed(2)}
                  onChange={(e) => {
                    const newFov = parseFloat(e.target.value)
                    updateConfig({ fieldOfView: newFov })
                    if (aladin) aladin.setFov(newFov)
                  }}
                  step={0.1}
                  min={0.1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleZoom('out')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Projection</h2>
              <Select value={config.projection} onValueChange={handleProjectionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select projection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AIT">Aitoff</SelectItem>
                  <SelectItem value="MOL">Mollweide</SelectItem>
                  <SelectItem value="SIN">Sinusoidal</SelectItem>
                  <SelectItem value="MER">Mercator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Coordinate Frame</h2>
              <Select value={config.cooFrame} onValueChange={handleCooFrameChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coordinate frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equatorial">Equatorial</SelectItem>
                  <SelectItem value="galactic">Galactic</SelectItem>
                  <SelectItem value="ecliptic">Ecliptic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Display Options</h2>
              <div className="space-y-2">
                {(Object.keys(config) as Array<keyof StarMapConfig>)
                  .filter(key => typeof config[key] === 'boolean')
                  .map(key => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={config[key] as boolean}
                        onCheckedChange={() => handleToggleControl(key)}
                      />
                      <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Reticle Settings</h2>
              <div className="grid gap-2">
                <Label htmlFor="reticleColor">Reticle Color</Label>
                <Input
                  id="reticleColor"
                  type="color"
                  value={config.reticleColor}
                  onChange={(e) => {
                    updateConfig({ reticleColor: e.target.value })
                    if (aladin) aladin.setReticleColor(e.target.value)
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reticleSize">Reticle Size</Label>
                <Input
                  id="reticleSize"
                  type="number"
                  value={config.reticleSize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value)
                    updateConfig({ reticleSize: newSize })
                    if (aladin) aladin.setReticleSize(newSize)
                  }}
                  min={1}
                  max={100}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Camera Parameters</h2>
              <div className="grid gap-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={config.camera.width}
                  onChange={(e) => updateConfig({
                    camera: { ...config.camera, width: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={config.camera.height}
                  onChange={(e) => updateConfig({
                    camera: { ...config.camera, height: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pixelSize">Pixel size (μm)</Label>
                <Input
                  id="pixelSize"
                  type="number"
                  value={config.camera.pixelSize}
                  onChange={(e) => updateConfig({
                    camera: { ...config.camera, pixelSize: parseFloat(e.target.value) }
                  })}
                  step={0.1}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="focalLength">Focal length (mm)</Label>
                <Input
                  id="focalLength"
                  type="number"
                  value={config.camera.focalLength || ''}
                  onChange={(e) => updateConfig({
                    camera: { ...config.camera, focalLength: parseFloat(e.target.value) || null }
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Camera FOV Overlay</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCameraFov"
                  checked={config.cameraFovOverlay.show}
                  onCheckedChange={(checked) => updateConfig({
                    cameraFovOverlay: { ...config.cameraFovOverlay, show: checked }
                  })}
                />
                <Label htmlFor="showCameraFov">Show Camera FOV</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cameraFovColor">Overlay Color</Label>
                <Input
                  id="cameraFovColor"
                  type="color"
                  value={config.cameraFovOverlay.color}
                  onChange={(e) => updateConfig({
                    cameraFovOverlay: { ...config.cameraFovOverlay, color: e.target.value }
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cameraFovOpacity">Overlay Opacity</Label>
                <Slider
                  id="cameraFovOpacity"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[config.cameraFovOverlay.opacity]}
                  onValueChange={([value]) => updateConfig({
                    cameraFovOverlay: { ...config.cameraFovOverlay, opacity: value }
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Targets</h2>
              <div className="grid gap-2">
                <Label>Horizontal panels</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateConfig({
                      targets: { ...config.targets, horizontalPanels: Math.max(1, config.targets.horizontalPanels - 1) }
                    })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={config.targets.horizontalPanels}
                    onChange={(e) => updateConfig({
                      targets: { ...config.targets, horizontalPanels: parseInt(e.target.value) }
                    })}
                    min={1}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateConfig({
                      targets: { ...config.targets, horizontalPanels: config.targets.horizontalPanels + 1 }
                    })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Vertical panels</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateConfig({
                      targets: { ...config.targets, verticalPanels: Math.max(1, config.targets.verticalPanels - 1) }
                    })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={config.targets.verticalPanels}
                    onChange={(e) => updateConfig({
                      targets: { ...config.targets, verticalPanels: parseInt(e.target.value) }
                    })}
                    min={1}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateConfig({
                      targets: { ...config.targets, verticalPanels: config.targets.verticalPanels + 1 }
                    })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Rotation</Label>
                <Slider
                  value={[config.targets.rotation]}
                  onValueChange={([value]) => updateConfig({
                    targets: { ...config.targets, rotation: value }
                  })}
                  max={360}
                  step={1}
                />
                <Input
                  type="number"
                  value={config.targets.rotation}
                  onChange={(e) => updateConfig({
                    targets: { ...config.targets, rotation: parseInt(e.target.value) }
                  })}
                  min={0}
                  max={360}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Constellations</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showConstellations"
                  checked={config.constellations.show}
                  onCheckedChange={(checked) => updateConfig({
                    constellations: { ...config.constellations, show: checked }
                  })}
                />
                <Label htmlFor="showConstellations">Show Constellations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showConstellationNames"
                  checked={config.constellations.names}
                  onCheckedChange={(checked) => updateConfig({
                    constellations: { ...config.constellations, names: checked }
                  })}
                />
                <Label htmlFor="showConstellationNames">Show Constellation Names</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showConstellationBoundaries"
                  checked={config.constellations.boundaries}
                  onCheckedChange={(checked) => updateConfig({
                    constellations: { ...config.constellations, boundaries: checked }
                  })}
                />
                <Label htmlFor="showConstellationBoundaries">Show Constellation Boundaries</Label>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Field of View (FOV)</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showFov"
                  checked={config.fov.show}
                  onCheckedChange={(checked) => updateConfig({
                    fov: { ...config.fov, show: checked }
                  })}
                />
                <Label htmlFor="showFov">Show FOV</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fovColor">FOV Color</Label>
                <Input
                  id="fovColor"
                  type="color"
                  value={config.fov.color}
                  onChange={(e) => updateConfig({
                    fov: { ...config.fov, color: e.target.value }
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label>FOV Rotation</Label>
                <Slider
                  value={[config.fov.rotation]}
                  onValueChange={([value]) => updateConfig({
                    fov: { ...config.fov, rotation: value }
                  })}
                  max={360}
                  step={1}
                />
                <Input
                  type="number"
                  value={config.fov.rotation}
                  onChange={(e) => updateConfig({
                    fov: { ...config.fov, rotation: parseInt(e.target.value) }
                  })}
                  min={0}
                  max={360}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => aladin?.increaseZoom()}>
            <Move className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => aladin?.decreaseZoom()}>
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleToggleControl('showCooGrid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => aladin?.resetView()}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleCooFrameChange('equatorial')}>
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => updateConfig({ imageSource: 'P/DSS2/color' })}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => updateConfig({ imageSource: 'P/allWISE/color' })}>
            <FileImage className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleProjectionChange('AIT')}>
            <Map className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleToggleControl('showSimbadPointerControl')}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleToggleControl('showReticle')}>
            <Crosshair className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleToggleControl('showLayersControl')}>
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleToggleControl('showShareControl')}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleToggleControl('showFullscreenControl')}>
            <Expand className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => updateConfig({
            cameraFovOverlay: { ...config.cameraFovOverlay, show: !config.cameraFovOverlay.show }
          })}>
            <Camera className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => updateConfig({
            targets: { ...config.targets, rotation: (config.targets.rotation + 90) % 360 }
          })}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => updateConfig({
            constellations: { ...config.constellations, show: !config.constellations.show }
          })}>
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => updateConfig({
            fov: { ...config.fov, show: !config.fov.show }
          })}>
            <Star className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={containerRef}
          id="aladin-lite-div"
          className="w-full h-full"
        />
      </Card>
    </div>
  )
}

