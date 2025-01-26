import { z } from "zod";

export const ForecastItemSchema = z.object({
  date: z.string(),
  temperature: z.number(),
  description: z.string(),
  precipitation: z.number().optional(),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
});

export const WeatherDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.string(),
  cloudCover: z.number(),
  description: z.string(),
  uvi: z.number(),
  pressure: z.number(),
  visibility: z.number(),
  sunrise: z.string(),
  sunset: z.string(),
  forecast: z.array(ForecastItemSchema).optional(),
  hourly: z
    .array(
      z.object({
        time: z.string(),
        temperature: z.number(),
        precipitation: z.number(),
      })
    )
    .optional(),
  alerts: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.string(),
        time: z.string(),
      })
    )
    .optional(),
});

export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type ForecastData = z.infer<typeof ForecastItemSchema>;

export interface WeatherAPI {
  name: string;
  fetchWeather: (
    city: string,
    units: string,
    apiKey: string
  ) => Promise<WeatherData>;
  fetchHistorical?: (
    city: string,
    days: number,
    apiKey: string
  ) => Promise<WeatherData[]>;
  fetchForecast?: (
    city: string,
    days: number,
    apiKey: string
  ) => Promise<ForecastData[]>;
}
