import { useState, useEffect } from "react";

// Mock data (you can move this to a separate file if it gets too large)
const mockCelestialObjects = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Celestial Object ${i + 1}`,
  type: ["OPNCL", "DRKNB", "BRTNB", "GALXY", "PLNTN", "STAR"][
    Math.floor(Math.random() * 6)
  ],
  constellation: ["UMA", "CYG", "PYX", "ORI", "CAS", "LEO"][
    Math.floor(Math.random() * 6)
  ],
  rightAscension: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}:${Math.floor(Math.random() * 60)}`,
  declination: `${Math.floor(Math.random() * 90)}° ${Math.floor(
    Math.random() * 60
  )}' ${Math.floor(Math.random() * 60)}"`,
  magnitude: Math.random() * 100,
  size: Math.floor(Math.random() * 1000),
  distance: Math.floor(Math.random() * 10000),
  riseTime: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}`,
  setTime: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}`,
  transitTime: `${Math.floor(Math.random() * 24)}:${Math.floor(
    Math.random() * 60
  )}`,
  transitAltitude: Math.floor(Math.random() * 90),
}));

export function useAstronomyData(useMockData: boolean) {
  interface CelestialObject {
    id: number;
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
  }

  const [celestialObjects, setCelestialObjects] = useState<CelestialObject[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          setCelestialObjects(mockCelestialObjects);
        } else {
          const response = await fetch("/api/celestial-objects");
          if (!response.ok) {
            throw new Error("Failed to fetch celestial objects");
          }
          const data = await response.json();
          setCelestialObjects(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [useMockData]);

  return { celestialObjects, loading, error };
}
