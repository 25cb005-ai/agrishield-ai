import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useOfflineSync } from "../../hooks/useOfflineSync";
import {
  type OfflineDiagnosisItem,
  clearOfflineQueue,
  getOfflineQueue,
} from "./types";

interface OfflineCaptureQueueProps {
  onSync?: (items: OfflineDiagnosisItem[]) => Promise<void>;
}

export function OfflineCaptureQueue({ onSync }: OfflineCaptureQueueProps) {
  const { t } = useLanguage();
  const [queue, setQueue] = useState<OfflineDiagnosisItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const { isOnline } = useOfflineSync(() => {
    setQueue(getOfflineQueue());
    setSyncDone(false);
  });

  useEffect(() => {
    setQueue(getOfflineQueue());
  }, []);

  if (queue.length === 0 && isOnline) return null;

  const handleSync = async () => {
    if (!onSync || queue.length === 0) return;
    setIsSyncing(true);
    try {
      await onSync(queue);
      clearOfflineQueue();
      setQueue([]);
      setSyncDone(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card
      className={[
        "border transition-smooth",
        isOnline
          ? "border-primary/30 bg-primary/5"
          : "border-destructive/30 bg-destructive/5",
      ].join(" ")}
      data-ocid="offline-queue.card"
    >
      <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          {isOnline ? (
            <Wifi size={18} className="text-primary shrink-0" />
          ) : (
            <WifiOff size={18} className="text-destructive shrink-0" />
          )}
          <div className="min-w-0">
            {!isOnline ? (
              <p className="text-sm font-medium text-foreground">
                {t("offline.banner")}
              </p>
            ) : (
              <p className="text-sm font-medium text-foreground">
                {syncDone
                  ? "All pending diagnoses synced!"
                  : `${queue.length} pending ${queue.length === 1 ? "diagnosis" : "diagnoses"} to sync`}
              </p>
            )}
          </div>
          {queue.length > 0 && (
            <Badge
              variant="outline"
              className="shrink-0 font-semibold"
              data-ocid="offline-queue.count.badge"
            >
              {queue.length}
            </Badge>
          )}
        </div>

        {isOnline && queue.length > 0 && (
          <Button
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2 shrink-0"
            data-ocid="offline-queue.sync_button"
          >
            <Wifi size={13} />
            {isSyncing ? "Syncing…" : "Sync Now"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
