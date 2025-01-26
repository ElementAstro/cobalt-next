export interface IDSOObjectInfo {
  name: string;
  ra: number;
  dec: number;
}

export interface IDSOFramingObjectInfo {
  name: string;
  ra: number;
  dec: number;
  rotation: number;
  altitude?: Array<[string, number, number]>;
  flag: string; // flag is user editable, any string is ok
  tag: string; // tag is system set filters.
  target_type: string;
  size: number;
  checked: boolean;
  // depreciated
  bmag?: number;
  vmag?: number;
  type?: string;
  notes?: string;
  groupIds?: string[];
  lastObserved?: Date;
  observationCount?: number;
}

export interface IDSOObjectDetailedInfo {
  angular_size: any;
  magnitude: any;
  type: any;
  id: string;
  name: string;
  alias: string;
  ra: number;
  dec: number;
  target_type: string;
  const: string;
  size: number;
  transit_month: number;
  transit_date: string;
  filter: string;
  focal_length: number;
  altitude: Array<[string, number, number]>;
  Top200: number | null;
  rotation: number;
  flag: string;
  tag: string;
  checked: boolean;
  // depreciated
  moon_distance?: number | null;
  bmag?: number | null;
  vmag?: number | null;
}

export interface IDSOObjectSimpleInfo {
  current: number;
  highest: number;
  available_shoot_time: number;
  az: number;
}

export interface ILightStarInfo {
  name: string;
  show_name: string;
  ra: number;
  dec: number;
  Const: string;
  Const_Zh: string;
  magnitude: number;
  alt: number;
  az: number;
  sky: string;
}

export interface ITwilightDataString {
  evening: {
    sun_set_time: string;
    evening_civil_time: string;
    evening_nautical_time: string;
    evening_astro_time: string;
  };
  morning: {
    sun_rise_time: string;
    morning_civil_time: string;
    morning_nautical_time: string;
    morning_astro_time: string;
  };
}

export interface ITwilightData {
  evening: {
    sun_set_time: Date;
    evening_civil_time: Date;
    evening_nautical_time: Date;
    evening_astro_time: Date;
  };
  morning: {
    sun_rise_time: Date;
    morning_civil_time: Date;
    morning_nautical_time: Date;
    morning_astro_time: Date;
  };
}

// export interface from the api

export interface IOFRequestLightStar {
  sky_range?: Array<string>;
  max_mag?: number;
}

export interface IOFResponseLightStar {
  success: boolean;
  data: Array<ILightStarInfo>;
}

export interface IOFResponseFindTargetName {
  success: boolean;
  data: Array<IDSOObjectDetailedInfo>;
}

export interface IOFRequestFOVpoints {
  x_pixels: number;
  y_pixels: number;
  x_pixel_size: number;
  y_pixel_size: number;
  focal_length: number;
  target_ra: number;
  target_dec: number;
  camera_rotation: number;
}

export interface IOFResponseFOVpoints {
  success: boolean;
  data: [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ];
  message?: string;
}

export interface IOFRequestFOVpointsTiles {
  x_pixels: number;
  y_pixels: number;
  x_pixel_size: number;
  y_pixel_size: number;
  focal_length: number;
  target_ra: number;
  target_dec: number;
  camera_rotation: number;
  x_tiles: number;
  y_tiles: number;
  overlap: number;
}

export interface IOFResponseFOVpointsTiles {
  success: boolean;
  data: Array<
    [[number, number], [number, number], [number, number], [number, number]]
  >;
  message?: string;
}

export interface IOFResponseAltCurve {
  success: boolean;
  data: {
    moon_distance: number;
    altitude: Array<[string, number, number]>;
    name: string;
    id: string;
    ra: number;
    dec: number;
    target_type: string;
    size: number;
  };
}

export interface IOFResponseTwilightData {
  success: boolean;
  data: ITwilightDataString;
}

export interface IOFResponseOBJSimple {
  success: boolean;
  data: IDSOObjectSimpleInfo;
}

export interface IBaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ITargetManagement {
  saveTarget(target: IDSOFramingObjectInfo): Promise<IBaseResponse<boolean>>;
  deleteTarget(name: string): Promise<IBaseResponse<boolean>>;
  updateTarget(target: IDSOFramingObjectInfo): Promise<IBaseResponse<boolean>>;
  getTargetList(): Promise<IBaseResponse<IDSOFramingObjectInfo[]>>;
}

export interface IObservationPlan {
  startTime: Date;
  endTime: Date;
  targets: IDSOFramingObjectInfo[];
  priority: number;
  weather: string;
}

export interface ISearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}

export interface IFavoriteTarget extends IDSOFramingObjectInfo {
  addedAt: Date;
  notes: string;
  customTags: string[];
  id: string;
}

export interface IAdvancedFilter {
  angular_size_min: number;
  angular_size_max: number;
  magnitude_min: number;
  magnitude_max: number;
  type: string[];
  constellation: string[];
  transit_month: number[];
  sort: {
    field: 'name' | 'magnitude' | 'size' | 'transit_date';
    order: 'asc' | 'desc';
  };
}

export interface ITargetGroup {
  id: string;
  name: string;
  description: string;
  targets: string[]; // target names
  createdAt: Date;
  updatedAt: Date;
}

export interface ITargetNote {
  targetName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITargetStatistics {
  totalCount: number;
  typeDistribution: { [key: string]: number };
  tagDistribution: { [key: string]: number };
  flagDistribution: { [key: string]: number };
  averageSize: number;
  monthlyDistribution: { [key: string]: number };
}

export interface ITargetObservationData {
  observationId: string;
  targetId: string;
  timestamp: Date;
  duration: number;
  weather: string;
  quality: number;
  notes: string;
  imageUrl?: string;
}

export interface ITargetWeatherCondition {
  date: Date;
  cloudCover: number;
  seeing: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  moonPhase: number;
  forecast: {
    probability: number;
    quality: string;
  };
}

export interface IObservationSession {
  id: string;
  date: Date;
  targets: Array<{
    target: IDSOFramingObjectInfo;
    startTime: Date;
    duration: number;
    priority: number;
  }>;
  weather: ITargetWeatherCondition;
  equipment: {
    telescope: string;
    camera: string;
    mount: string;
    filters: string[];
  };
  notes: string;
}
