export interface CelestialObject {
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
}

export interface SearchFilters {
  constellations: string[];
  types: string[];
  minMagnitude: number;
  maxMagnitude: number;
  minDistance: number;
  maxDistance: number;
}

export interface RealTimeData {
  timestamp: string;
  moonPhase: number;
  visiblePlanets: string[];
  weather: {
    cloudCover: number;
    temperature: number;
    humidity: number;
  };
}
