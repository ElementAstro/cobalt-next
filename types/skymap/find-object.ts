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
}

export interface IDSOObjectDetailedInfo {
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

// 新增基础响应类型
export interface IBaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 新增目标管理相关接口
export interface ITargetManagement {
  saveTarget(target: IDSOFramingObjectInfo): Promise<IBaseResponse<boolean>>;
  deleteTarget(name: string): Promise<IBaseResponse<boolean>>;
  updateTarget(target: IDSOFramingObjectInfo): Promise<IBaseResponse<boolean>>;
  getTargetList(): Promise<IBaseResponse<IDSOFramingObjectInfo[]>>;
}

// 新增观测计划接口
export interface IObservationPlan {
  startTime: Date;
  endTime: Date;
  targets: IDSOFramingObjectInfo[];
  priority: number;
  weather: string;
}
