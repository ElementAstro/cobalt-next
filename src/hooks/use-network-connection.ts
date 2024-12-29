import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [status, setStatus] = useState({
    online: typeof navigator !== "undefined" ? navigator.onLine : true, // Fallback to `true` during SSR
    downlink: undefined,
    rtt: undefined,
    type: undefined,
    effectiveType: undefined,
    saveData: undefined,
    downlinkMax: undefined,
  });

  useEffect(() => {
    // Check if `navigator` exists before adding listeners
    if (typeof navigator !== "undefined") {
      const updateNetworkStatus = () => {
        const connection = (navigator as any).connection;
        setStatus({
          online: navigator.onLine,
          downlink: connection?.downlink,
          rtt: connection?.rtt,
          type: connection?.type,
          effectiveType: connection?.effectiveType,
          saveData: connection?.saveData,
          downlinkMax: connection?.downlinkMax,
        });
      };

      // Add event listeners for network status
      window.addEventListener("online", updateNetworkStatus);
      window.addEventListener("offline", updateNetworkStatus);

      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener("change", updateNetworkStatus);
      }

      // Initial status update
      updateNetworkStatus();

      // Cleanup listeners
      return () => {
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
        if (connection) {
          connection.removeEventListener("change", updateNetworkStatus);
        }
      };
    }
  }, []);

  return status;
}
