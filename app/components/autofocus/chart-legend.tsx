export function ChartLegend() {
  return (
    <div className="flex gap-4 items-center mb-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-1 bg-green-500" />
        <span className="text-sm text-zinc-400">HFD</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-1 bg-blue-500" />
        <span className="text-sm text-zinc-400">StarIndex</span>
      </div>
    </div>
  );
}
