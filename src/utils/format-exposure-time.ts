export function formatExposureTime(value: number): string {
  const seconds = Math.pow(2, value);
  if (seconds >= 1) {
    return `${seconds.toFixed(1)}s`;
  } else {
    const fraction = Math.round(1 / seconds);
    return `1/${fraction}s`;
  }
}
