import { useState, useEffect } from 'react';

export default function useNetworkStatus() {
  const [status, setStatus] = useState({
    online: navigator.onLine,
    downlink: undefined,
    rtt: undefined,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection;
      setStatus({
        online: navigator.onLine,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      });
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return status;
}
