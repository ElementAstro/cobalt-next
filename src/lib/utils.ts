import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Nullable<T> = T | null | undefined;

export function isNotNullOrUndefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDegrees(value: number | undefined): string {
  if (value === undefined || value === null) return "未知";
  
  const degrees = Math.floor(value);
  const minutesFloat = (value - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(1);

  if (degrees === 0 && minutes === 0) {
    return `${seconds}″`;
  } else if (degrees === 0) {
    return `${minutes}′${seconds}″`;
  }
  return `${degrees}°${minutes}′${seconds}″`;
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

export function calculateAltitude(ra: number, dec: number, time: Date): number {
  // 简化的地平高度计算
  const latitude = 35; // 假设观测者在北纬35度
  const longitude = 116; // 假设观测者在东经116度
  
  const LST = calculateLST(time, longitude);
  const HA = LST - ra;
  
  const sinAlt = Math.sin(dec * Math.PI/180) * Math.sin(latitude * Math.PI/180) +
                 Math.cos(dec * Math.PI/180) * Math.cos(latitude * Math.PI/180) * 
                 Math.cos(HA * Math.PI/180);
                 
  return Math.asin(sinAlt) * 180/Math.PI;
}

function calculateLST(time: Date, longitude: number): number {
  const JD = calculateJD(time);
  const T = (JD - 2451545.0) / 36525;
  const theta0 = 280.46061837 + 360.98564736629 * (JD - 2451545.0) +
                 0.000387933 * T * T - T * T * T / 38710000;
                 
  let LST = theta0 + longitude;
  
  while (LST < 0) LST += 360;
  while (LST > 360) LST -= 360;
  
  return LST;
}

function calculateJD(time: Date): number {
  const year = time.getUTCFullYear();
  const month = time.getUTCMonth() + 1;
  const day = time.getUTCDate();
  const hour = time.getUTCHours();
  const minute = time.getUTCMinutes();
  const second = time.getUTCSeconds();
  
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const a = Math.floor(y/100);
  const b = 2 - a + Math.floor(a/4);
  
  const JD = Math.floor(365.25*(y + 4716)) + Math.floor(30.6001*(m + 1)) + 
            day + b - 1524.5 + 
            hour/24 + minute/1440 + second/86400;
            
  return JD;
}
