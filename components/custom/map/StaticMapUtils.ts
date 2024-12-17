export function constructMapUrl(params: {
  key: string;
  location: string;
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
    key: params.key,
    location: params.location,
    zoom: params.zoom.toString(),
    size: params.size || "400*400",
    scale: (params.scale || 1).toString(),
    ...(params.markers && { markers: params.markers }),
    ...(params.labels && { labels: params.labels }),
    ...(params.paths && { paths: params.paths }),
    ...(params.traffic !== undefined && { traffic: params.traffic.toString() }),
    ...(params.style && { style: params.style }),
  });

  return `${baseUrl}?${queryParams.toString()}`;
}
