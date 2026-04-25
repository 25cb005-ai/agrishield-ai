import { useCallback, useEffect, useState } from "react";

export function useOfflineSync(onReconnect?: () => void) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    onReconnect?.();
  }, [onReconnect]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline };
}
