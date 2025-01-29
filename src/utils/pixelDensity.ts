export function calculateDensityMap(data: {
  width: number;
  height: number;
  hotPixels: number[];
  coldPixels: number[];
}) {
  const gridSize = 32;
  const densityMap = Array(gridSize)
    .fill(0)
    .map(() => Array(gridSize).fill(0));

  const cellWidth = data.width / gridSize;
  const cellHeight = data.height / gridSize;

  [...data.hotPixels, ...data.coldPixels].forEach((pixel) => {
    const x = Math.floor((pixel % data.width) / cellWidth);
    const y = Math.floor(Math.floor(pixel / data.width) / cellHeight);
    if (x < gridSize && y < gridSize) {
      densityMap[y][x]++;
    }
  });

  return densityMap;
}

export function generateTrendData(hours = 24) {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${i}:00`,
    hot: Math.floor(Math.random() * 100),
    cold: Math.floor(Math.random() * 50),
  }));
}

export const trendData = generateTrendData();
