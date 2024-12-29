import { z } from "zod";

export const LocationSchema = z.object({
  latitude: z.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/),
  longitude: z
    .string()
    .regex(/^[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?|180(\.0+)?$/),
});

export const MoonDataSchema = z.object({
  phase: z.string(),
  light: z.string(),
  rise: z.string(),
  transit: z.string(),
  set: z.string(),
  az: z.string().optional(),
  alt: z.string().optional(),
  ra: z.string().optional(),
  dec: z.string().optional(),
  new: z.string().optional(),
  full: z.string().optional(),
});

export const SunDataSchema = z.object({
  at_start: z.string(),
  ct_start: z.string(),
  rise: z.string(),
  transit: z.string(),
  set: z.string(),
  ct_end: z.string(),
  at_end: z.string(),
  az: z.string().optional(),
  alt: z.string().optional(),
  ra: z.string().optional(),
  dec: z.string().optional(),
  equinox: z.string().optional(),
  solstice: z.string().optional(),
});

export const PolarisDataSchema = z.object({
  next_transit: z.string(),
  alt: z.string(),
  hour_angle: z.number(),
});

export const WeatherForecastSchema = z.object({
  time: z.string(),
  temp: z.string(),
  condition: z.string(),
});

export const WeatherDataSchema = z.object({
  temperature: z.string(),
  humidity: z.string(),
  pressure: z.string(),
  wind_speed: z.string(),
  wind_direction: z.string(),
  cloud_cover: z.string(),
  visibility: z.string(),
  forecast: z.array(WeatherForecastSchema),
});

export const ObservingConditionsSchema = z.object({
  seeing: z.string(),
  transparency: z.string(),
  darkness: z.string(),
  recommended: z.boolean(),
});

export const PlanetDataSchema = z.object({
  name: z.string(),
  rise: z.string(),
  transit: z.string(),
  set: z.string(),
  altitude: z.number(),
  azimuth: z.number(),
  magnitude: z.number(),
  phase: z.number().optional(),
  distance: z.number(),
});

export const SolarSystemSchema = z.object({
  planets: z.array(PlanetDataSchema),
  lastUpdate: z.string(),
});

export const CelestialDataSchema = z
  .object({
    polaris: PolarisDataSchema,
    moon: MoonDataSchema,
    sun: SunDataSchema,
    current_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    location: LocationSchema.optional(),
    weather: WeatherDataSchema,
    observing_conditions: ObservingConditionsSchema,
    celestial_events: z.array(z.string()).optional(), // 可选的天文事件列表
    // 增加新的天文事件字段
    upcoming_events: z
      .array(
        z.object({
          name: z.string(),
          date: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
          }),
          description: z.string().optional(),
        })
      )
      .optional(),
    solarSystem: SolarSystemSchema,
    errorLogs: z
      .array(
        z.object({
          timestamp: z.string(),
          message: z.string(),
          severity: z.enum(["info", "warning", "error"]),
        })
      )
      .optional(),
  })
  .strict();

export type Location = z.infer<typeof LocationSchema>;
export type MoonData = z.infer<typeof MoonDataSchema>;
export type SunData = z.infer<typeof SunDataSchema>;
export type PolarisData = z.infer<typeof PolarisDataSchema>;
export type WeatherData = z.infer<typeof WeatherDataSchema>;
export type ObservingConditions = z.infer<typeof ObservingConditionsSchema>;
export type CelestialData = z.infer<typeof CelestialDataSchema>;
export type PlanetData = z.infer<typeof PlanetDataSchema>;
export type SolarSystem = z.infer<typeof SolarSystemSchema>;
