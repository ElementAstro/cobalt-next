"use client";

import { useState, useEffect } from "react";
import { Cog, RefreshCcw, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDomeStore } from "@/lib/store/device/dome";
import { domeApi } from "@/services/device/dome";
import { mockDomeApi } from "@/utils/mock-dome";

const api =
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ? mockDomeApi : domeApi;

export default function DomeSimulator() {
  const {
    azimuth,
    shutterStatus,
    isConnected,
    isSynced,
    isSlewing,
    error,
    setAzimuth,
    setShutterStatus,
    setConnected,
    setSynced,
    setSlewing,
    setError,
  } = useDomeStore();

  const [targetAzimuth, setTargetAzimuth] = useState(azimuth);

  useEffect(() => {
    setTargetAzimuth(azimuth);
  }, [azimuth]);

  const handleConnect = async () => {
    try {
      await api.connect();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.disconnect();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSlewToAzimuth = async () => {
    try {
      setSlewing(true);
      await api.setAzimuth(targetAzimuth);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleOpenShutter = async () => {
    try {
      await api.openShutter();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCloseShutter = async () => {
    try {
      await api.closeShutter();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSync = async () => {
    try {
      await api.sync();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleFindHome = async () => {
    try {
      await api.findHome();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleStop = async () => {
    try {
      await api.stop();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePark = async () => {
    try {
      await api.park();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dome</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleConnect}
            disabled={isConnected}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDisconnect}
            disabled={!isConnected}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <span className="ml-2">Settings</span>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Simulator Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Connection Status</TableCell>
                <TableCell>
                  {isConnected ? "Connected" : "Disconnected"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Azimuth</TableCell>
                <TableCell>{azimuth}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Shutter status</TableCell>
                <TableCell>{shutterStatus}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Slewing</TableCell>
                <TableCell>{isSlewing ? "Yes" : "No"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Control Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Synchronization */}
        <Card>
          <CardHeader>
            <CardTitle>Synchronization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sync-toggle">Dome follows telescope</Label>
              <Switch
                id="sync-toggle"
                checked={isSynced}
                onCheckedChange={handleSync}
                disabled={!isConnected}
              />
              <span className="text-sm text-muted-foreground">
                {isSynced ? "ON" : "OFF"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Manual Control */}
        <Card>
          <CardHeader>
            <CardTitle>Manual control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleOpenShutter}
                disabled={
                  !isConnected ||
                  shutterStatus === "open" ||
                  shutterStatus === "opening"
                }
              >
                Open Shutter
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleCloseShutter}
                disabled={
                  !isConnected ||
                  shutterStatus === "closed" ||
                  shutterStatus === "closing"
                }
              >
                Close Shutter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setTargetAzimuth(Math.max(0, targetAzimuth - 1))}
                disabled={!isConnected}
              >
                -
              </Button>
              <Input
                type="number"
                value={targetAzimuth}
                onChange={(e) => setTargetAzimuth(Number(e.target.value))}
                className="w-20 text-center"
                disabled={!isConnected}
              />
              <Button
                variant="outline"
                onClick={() =>
                  setTargetAzimuth(Math.min(360, targetAzimuth + 1))
                }
                disabled={!isConnected}
              >
                +
              </Button>
              <Button
                variant="secondary"
                onClick={handleSlewToAzimuth}
                disabled={!isConnected || isSlewing}
              >
                Slew
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="default"
          className="w-full"
          onClick={handleSync}
          disabled={!isConnected}
        >
          Sync
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={handleFindHome}
          disabled={!isConnected}
        >
          Find home
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={handleStop}
          disabled={!isConnected}
        >
          Stop
        </Button>
        <Button
          variant="default"
          className="w-full"
          onClick={handlePark}
          disabled={!isConnected}
        >
          Set as park
        </Button>
      </div>
    </div>
  );
}
