export interface Location {
  latitude: string;
  longitude: string;
}

export interface MoonData {
  phase: string;
  light: string;
  rise: string;
  transit: string;
  set: string;
  az: string;
  alt: string;
  ra: string;
  dec: string;
  new: string;
  full: string;
}

export interface SunData {
  at_start: string;
  ct_start: string;
  rise: string;
  transit: string;
  set: string;
  ct_end: string;
  at_end: string;
  az: string;
  alt: string;
  ra: string;
  dec: string;
  equinox: string;
  solstice: string;
}

export interface PolarisData {
  next_transit: string;
  alt: string;
  hour_angle: number;
}

export interface WeatherData {
  temperature: string;
  humidity: string;
  pressure: string;
  wind_speed: string;
  wind_direction: string;
  cloud_cover: string;
  visibility: string;
}

export interface CelestialData {
  polaris: PolarisData;
  moon: MoonData;
  sun: SunData;
  current_time: string;
  location?: Location;
  weather: WeatherData;
  [key: string]:
    | string
    | number
    | Location
    | MoonData
    | SunData
    | PolarisData
    | WeatherData
    | undefined;
}
