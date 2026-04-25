import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";
import { motion } from "motion/react";
import type { CropDiagnosis } from "../../types";
import { formatDate, getSeverityClass, getSeverityLabel } from "../../types";

interface RecentDiagnosisProps {
  diagnosis: CropDiagnosis;
  index: number;
}

export default function RecentDiagnosis({
  diagnosis,
  index,
}: RecentDiagnosisProps) {
  const severityClass = getSeverityClass(diagnosis.severity);
  const severityLabel = getSeverityLabel(diagnosis.severity);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="flex items-center gap-3 py-3 border-b border-border last:border-0"
      data-ocid={`dashboard.recent-diagnosis.item.${index + 1}`}
    >
      {/* Crop image or icon */}
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {diagnosis.image_url ? (
          <img
            src={diagnosis.image_url}
            alt={diagnosis.crop_name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Leaf size={18} className="text-primary" />
        )}
      </div>

      {/* Crop info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate capitalize">
          {diagnosis.crop_name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {diagnosis.disease_name}
        </p>
      </div>

      {/* Right side: severity + date */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <Badge
          className={`text-[10px] px-1.5 py-0 font-medium border-0 ${severityClass}`}
        >
          {severityLabel}
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          {formatDate(diagnosis.created_at)}
        </span>
      </div>
    </motion.div>
  );
}
