import { useState, useEffect } from "react";

interface TelescopeInfo {
  siteLatitude: string;
  siteLongitude: string;
  rightAscension: string;
  declination: string;
  altitude: string;
  azimuth: string;
}

interface CameraInfo {
  sensorType: string;
  sensorSize: string;
  pixelSize: string;
  temperature: number;
  targetTemperature: number;
  coolerOn: boolean;
  temperatureHistory: { time: string; temperature: number }[];
}

interface GuiderInfo {
  pixelScale: number;
  state: string;
  showCorrections: boolean;
  phd2Profile: string;
}

interface FocuserInfo {
  position: number;
  temperature: number;
  temperatureCompensation: boolean;
}

interface FilterWheelInfo {
  name: string;
  driverInfo: string;
  driverVersion: string;
  currentFilter: string;
  filters: string[];
  description: string;
}

export function useMockBackend() {
  const [telescopeInfo, setTelescopeInfo] = useState<TelescopeInfo>({
    siteLatitude: "51° 04' 43\"",
    siteLongitude: "-00° 17' 40\"",
    rightAscension: "00:00:00",
    declination: "00:00:00",
    altitude: "0° 00' 00\"",
    azimuth: "0° 00' 00\"",
  });

  const [cameraInfo, setCameraInfo] = useState<CameraInfo>({
    sensorType: "Monochrome",
    sensorSize: "640 x 480",
    pixelSize: "3.8 μm",
    temperature: 20,
    targetTemperature: -10,
    coolerOn: false,
    temperatureHistory: [],
  });

  const [guiderInfo, setGuiderInfo] = useState<GuiderInfo>({
    pixelScale: 1.31,
    state: "Idle",
    showCorrections: true,
    phd2Profile: "Default",
  });

  const [focuserInfo, setFocuserInfo] = useState<FocuserInfo>({
    position: 12500,
    temperature: 20,
    temperatureCompensation: false,
  });

  const [filterWheelInfo, setFilterWheelInfo] = useState<FilterWheelInfo>({
    name: "Manual filter wheel",
    driverInfo: "n.A.",
    driverVersion: "1.0",
    currentFilter: "Luminance",
    filters: ["Luminance", "Red", "Green", "Blue", "Ha"],
    description:
      "Mirrors the filters that are set up inside the options. When a filter change is requested a notification will pop up to manually change the filter.",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelescopeInfo((prev) => ({
        ...prev,
        rightAscension: randomRA(),
        declination: randomDec(),
        altitude: randomAlt(),
        azimuth: randomAz(),
      }));

      setCameraInfo((prev) => {
        const newTemp = prev.coolerOn
          ? Math.max(prev.temperature - 0.1, prev.targetTemperature)
          : Math.min(prev.temperature + 0.1, 20);
        return {
          ...prev,
          temperature: newTemp,
          temperatureHistory: [
            ...prev.temperatureHistory.slice(-60),
            { time: new Date().toISOString(), temperature: newTemp },
          ],
        };
      });

      setFocuserInfo((prev) => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const moveTelescopeManual = (direction: string) => {
    console.log(`Moving telescope ${direction}`);
    // In a real implementation, this would send a command to the telescope
  };

  const slewToCoordinates = (ra: string, dec: string) => {
    console.log(`Slewing to RA: ${ra}, Dec: ${dec}`);
    // In a real implementation, this would send a command to the telescope
  };

  const parkTelescope = () => {
    console.log("Parking telescope");
    // In a real implementation, this would send a command to the telescope
  };

  const homeTelescope = () => {
    console.log("Homing telescope");
    // In a real implementation, this would send a command to the telescope
  };

  const startExposure = (exposure: number, gain: number, binning: number) => {
    console.log(
      `Starting exposure: ${exposure}s, Gain: ${gain}, Binning: ${binning}x${binning}`
    );
    // In a real implementation, this would send a command to the camera
  };

  const abortExposure = () => {
    console.log("Aborting exposure");
    // In a real implementation, this would send a command to the camera
  };

  const setTemperature = (temp: number) => {
    setCameraInfo((prev) => ({ ...prev, targetTemperature: temp }));
  };

  const toggleCooler = () => {
    setCameraInfo((prev) => ({ ...prev, coolerOn: !prev.coolerOn }));
  };

  const startGuiding = () => {
    setGuiderInfo((prev) => ({ ...prev, state: "Guiding" }));
  };

  const stopGuiding = () => {
    setGuiderInfo((prev) => ({ ...prev, state: "Idle" }));
  };

  const dither = (pixels: number) => {
    console.log(`Dithering by ${pixels} pixels`);
    // In a real implementation, this would send a command to the guider
  };

  const setGuiderSettings = (settings: Partial<GuiderInfo>) => {
    setGuiderInfo((prev) => ({ ...prev, ...settings }));
  };

  const moveFocuser = (steps: number) => {
    setFocuserInfo((prev) => ({ ...prev, position: prev.position + steps }));
  };

  const setTemperatureCompensation = (enabled: boolean) => {
    setFocuserInfo((prev) => ({ ...prev, temperatureCompensation: enabled }));
  };

  const changeFilter = (filterIndex: number) => {
    setFilterWheelInfo((prev) => ({
      ...prev,
      currentFilter: prev.filters[filterIndex - 1],
    }));
  };

  return {
    telescopeInfo,
    cameraInfo,
    guiderInfo,
    focuserInfo,
    filterWheelInfo,
    moveTelescopeManual,
    slewToCoordinates,
    parkTelescope,
    homeTelescope,
    startExposure,
    abortExposure,
    setTemperature,
    toggleCooler,
    startGuiding,
    stopGuiding,
    dither,
    setGuiderSettings,
    moveFocuser,
    setTemperatureCompensation,
    changeFilter,
  };
}

function randomRA() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function randomDec() {
  const degrees = Math.floor(Math.random() * 181) - 90;
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return `${degrees.toString().padStart(3, "0")}° ${minutes
    .toString()
    .padStart(2, "0")}' ${seconds.toString().padStart(2, "0")}"`;
}

function randomAlt() {
  const degrees = Math.floor(Math.random() * 91);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return `${degrees.toString().padStart(2, "0")}° ${minutes
    .toString()
    .padStart(2, "0")}' ${seconds.toString().padStart(2, "0")}"`;
}

function randomAz() {
  const degrees = Math.floor(Math.random() * 360);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return `${degrees.toString().padStart(3, "0")}° ${minutes
    .toString()
    .padStart(2, "0")}' ${seconds.toString().padStart(2, "0")}"`;
}
