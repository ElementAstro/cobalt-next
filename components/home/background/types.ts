export interface Template {
  name: string;
  backgroundColor: string;
  backgroundImage: string;
  gradient: {
    color1: string;
    color2: string;
    type: string;
    angle: number;
  };
  blendMode: string;
  backgroundPattern: string;
  filters: {
    blur: number;
    brightness: number;
    contrast: number;
    grayscale: number;
    hueRotate: number;
    saturate: number;
  };
  animation: {
    type: string;
    duration: number;
    direction: string;
  };
  imageSize: string;
  imagePosition: string;
  imageRotation: number;
  imageOpacity: number;
}
