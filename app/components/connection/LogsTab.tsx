export function LogsTab() {
  return (
    <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto">
      <pre className="text-sm">
        {`[2023-07-01 10:00:15] Connected to Mount
[2023-07-01 10:00:16] Camera 1 initialized
[2023-07-01 10:00:17] Focuser ready
[2023-07-01 10:00:18] Filter wheel connected
[2023-07-01 10:00:19] Weather station data received
[2023-07-01 10:00:20] All systems operational`}
      </pre>
    </div>
  );
}
