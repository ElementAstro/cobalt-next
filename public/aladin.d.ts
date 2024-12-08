// Aladin Lite TypeScript Declarations

declare module "aladin-lite" {
  export interface AladinOptions {
    survey?: string;
    surveyUrl?: string[];
    hipsList?: (string | HiPSOptions)[];
    target?: string;
    cooFrame?: CooFrame;
    fov?: number;
    northPoleOrientation?: number;
    backgroundColor?: string;
    showZoomControl?: boolean;
    showLayersControl?: boolean;
    expandLayersControl?: boolean;
    showFullscreenControl?: boolean;
    showSimbadPointerControl?: boolean;
    showCooGridControl?: boolean;
    showSettingsControl?: boolean;
    showShareControl?: boolean;
    showStatusBar?: boolean;
    showFrame?: boolean;
    showFov?: boolean;
    showCooLocation?: boolean;
    showProjectionControl?: boolean;
    showContextMenu?: boolean;
    showReticle?: boolean;
    showCatalog?: boolean;
    showCooGrid?: boolean;
    fullScreen?: boolean;
    reticleColor?: string;
    reticleSize?: number;
    gridColor?: string;
    gridOpacity?: number;
    gridOptions?: GridOptions;
    projection?: string;
    log?: boolean;
    samp?: boolean;
    realFullscreen?: boolean;
    pixelateCanvas?: boolean;
  }

  export interface HiPSOptions {
    name?: string;
    id?: string;
    url?: string;
    creatorDid?: string;
    maxOrder?: number;
    tileSize?: number;
    numBitsPerPixel?: number;
    imgFormat?: string;
    cooFrame?: string;
    minCut?: number;
    maxCut?: number;
    stretch?: string;
    colormap?: string;
  }

  export interface GridOptions {
    enabled?: boolean;
    showLabels?: boolean;
    thickness?: number;
    opacity?: number;
    labelSize?: number;
    color?: string;
  }

  export type CooFrame =
    | "equatorial"
    | "ICRS"
    | "ICRSD"
    | "j2000"
    | "gal"
    | "galactic";

  export interface CircleSelection {
    x: number;
    y: number;
    r: number;
    contains: (point: { x: number; y: number }) => boolean;
    bbox: () => { left: number; right: number; top: number; bottom: number };
  }

  export interface RectSelection {
    x: number;
    y: number;
    w: number;
    h: number;
    contains: (point: { x: number; y: number }) => boolean;
    bbox: () => { left: number; right: number; top: number; bottom: number };
  }

  export interface PolygonSelection {
    vertices: { x: number; y: number }[];
    contains: (point: { x: number; y: number }) => boolean;
    bbox: () => { left: number; right: number; top: number; bottom: number };
  }

  export type ListenerCallback =
    | "select"
    | "objectsSelected"
    | "objectClicked"
    | "objectHovered"
    | "objectHoveredStop"
    | "footprintClicked"
    | "footprintHovered"
    | "positionChanged"
    | "zoomChanged"
    | "click"
    | "rightClickMove"
    | "mouseMove"
    | "fullScreenToggled"
    | "cooFrameChanged"
    | "resizeChanged"
    | "projectionChanged"
    | "layerChanged";

  export class Aladin {
    constructor(
      aladinDiv: string | HTMLElement,
      requestedOptions?: AladinOptions
    );

    static VERSION: string;
    static JSONP_PROXY: string;
    static URL_PREVIEWER: string;
    static DEFAULT_OPTIONS: AladinOptions;

    setFoV(FoV: number): void;
    gotoObject(
      targetName: string,
      callbackOptions?: { success?: Function; error?: Function }
    ): void;
    gotoRaDec(ra: number, dec: number): void;
    getRaDec(): number[];
    getFrame(): CooFrame;
    setFrame(frame: CooFrame): void;
    toggleFullscreen(realFullscreen?: boolean): void;
    addOverlay(overlay: any): void;
    removeOverlay(overlay: string | any): void;
    on(event: ListenerCallback, callback: Function): void;
    selectObjects(objects: any[]): void;
    showPopup(
      ra: number,
      dec: number,
      title: string,
      content: string,
      circleRadius?: number
    ): void;
    hidePopup(): void;
    getShareURL(): string;
    getEmbedCode(): string;
    displayFITS(
      url: string,
      options?: any,
      successCallback?: (
        ra: number,
        dec: number,
        fov: number,
        image: any
      ) => void,
      errorCallback?: Function,
      layer?: string
    ): void;
    displayJPG(
      url: string,
      options?: any,
      successCallback?: Function,
      errorCallback?: Function,
      layer?: string
    ): void;
    pix2world(x: number, y: number, frame?: CooFrame): number[];
    world2pix(lon: number, lat: number, frame?: CooFrame): number[];
    getListOfColormaps(): string[];
    addColormap(label: string, colors: string[]): void;

    // More methods can be added as needed...
  }

  export const A: {
    aladin: (div: string | HTMLElement, options?: AladinOptions) => Aladin;
    createImageSurvey: (
      id: string,
      name?: string,
      url?: string,
      cooFrame?: string,
      maxOrder?: number,
      options?: any
    ) => any;
    displayFITS: (
      url: string,
      options?: any,
      successCallback?: Function,
      errorCallback?: Function
    ) => void;
    displayJPG: (
      url: string,
      options?: any,
      successCallback?: Function,
      errorCallback?: Function
    ) => void;
    // Add other methods and properties as necessary
  };
}
