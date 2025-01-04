export function constructMapUrl(params: {
  key: string;
  location?: string;
  zoom: number;
  size?: string;
  scale?: number;
  markers?: string;
  labels?: string;
  paths?: string;
  traffic?: number;
  style?: string;
}) {
  const baseUrl = "https://restapi.amap.com/v3/staticmap";
  const queryParams = new URLSearchParams({
    key: "44fc0016a614cb00ed9d8000eb8f9428",
    zoom: params.zoom.toString(),
    size: params.size || "400*400",
    ...(params.location ? { location: params.location } : {}),
  });

  return `${baseUrl}?${queryParams}`;
}