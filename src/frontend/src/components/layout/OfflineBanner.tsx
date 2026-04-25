import { WifiOff } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useOfflineSync } from "../../hooks/useOfflineSync";

export default function OfflineBanner() {
  const { isOnline } = useOfflineSync();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-medium w-full z-50">
      <WifiOff size={16} className="shrink-0" />
      <span>{t("offline.banner")}</span>
    </div>
  );
}
