// @/utils/validation.ts

export const validateShutterSpeed = (value: string): string | null => {
    const validOptions = [
      "1/1000",
      "1/500",
      "1/250",
      "1/125",
      "1/60",
      "1/30",
      "1/15",
      "1/8",
      "1/4",
      "1/2",
      "1",
      "2",
      "4",
      "8",
      "15",
      "30",
    ];
    return validOptions.includes(value) ? null : "Invalid shutter speed.";
  };
  
  export const validateISO = (value: string): string | null => {
    const validOptions = ["100", "200", "400", "800", "1600", "3200", "6400", "12800"];
    return validOptions.includes(value) ? null : "Invalid ISO value.";
  };
  
  export const validateAperture = (value: string): string | null => {
    const validOptions = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16", "f/22"];
    return validOptions.includes(value) ? null : "Invalid aperture value.";
  };
  
  export const validateFocusPoint = (value: any): string | null => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 100 ? null : "Focus point must be between 0 and 100.";
  };
  
  export const validateFilterType = (value: string): string | null => {
    const validOptions = ["Clear", "Red", "Green", "Blue", "Luminance"];
    return validOptions.includes(value) ? null : "Invalid filter type.";
  };
  
  export const validateExposureCompensation = (value: number): string | null => {
    return value >= -3 && value <= 3 ? null : "Exposure compensation must be between -3 and 3.";
  };