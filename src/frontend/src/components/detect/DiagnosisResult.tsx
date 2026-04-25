import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FlaskConical,
  Leaf,
  Save,
  Sprout,
} from "lucide-react";
import { Severity } from "../../backend";
import { useLanguage } from "../../context/LanguageContext";
import type { MockDiagnosis } from "./types";

interface DiagnosisResultProps {
  diagnosis: MockDiagnosis;
  imageUrl: string;
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  onDownload: () => void;
  onReset: () => void;
}

const severityConfig: Record<
  Severity,
  { label: string; badgeClass: string; icon: typeof AlertCircle }
> = {
  [Severity.low]: {
    label: "Low",
    badgeClass: "badge-low",
    icon: CheckCircle,
  },
  [Severity.moderate]: {
    label: "Moderate",
    badgeClass: "badge-moderate",
    icon: AlertCircle,
  },
  [Severity.high]: {
    label: "High",
    badgeClass: "badge-high",
    icon: AlertCircle,
  },
  [Severity.critical]: {
    label: "Critical",
    badgeClass: "badge-critical",
    icon: AlertCircle,
  },
};

export function DiagnosisResult({
  diagnosis,
  imageUrl,
  isSaving,
  isSaved,
  onSave,
  onDownload,
  onReset,
}: DiagnosisResultProps) {
  const { t } = useLanguage();
  const conf = severityConfig[diagnosis.severity];
  const SeverityIcon = conf.icon;
  const confidenceNum = Number(diagnosis.confidence);
  const needsExpert =
    diagnosis.severity === Severity.high ||
    diagnosis.severity === Severity.critical;

  return (
    <div className="space-y-4" data-ocid="diagnosis-result.card">
      {/* Header card with image + disease summary */}
      <Card className="overflow-hidden border-border">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-muted">
            <img
              src={imageUrl}
              alt="Analyzed crop"
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="flex-1 p-5 space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("detect.result")}
                </p>
                <h2 className="font-display text-xl font-bold text-foreground mt-0.5">
                  {diagnosis.disease_name}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Leaf size={12} className="text-primary" />
                  {diagnosis.crop_name}
                </p>
              </div>
              <Badge
                className={`${conf.badgeClass} px-3 py-1 text-sm font-semibold flex items-center gap-1.5 rounded-full border-0`}
                data-ocid="diagnosis-result.severity.badge"
              >
                <SeverityIcon size={12} />
                {t(
                  `severity.${diagnosis.severity}` as
                    | "severity.low"
                    | "severity.moderate"
                    | "severity.high"
                    | "severity.critical",
                )}
              </Badge>
            </div>

            {/* Confidence bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("detect.confidence")}</span>
                <span className="font-medium text-foreground">
                  {confidenceNum}%
                </span>
              </div>
              <Progress
                value={confidenceNum}
                className="h-2"
                data-ocid="diagnosis-result.confidence.progress"
              />
            </div>

            {/* Quality status */}
            <p className="text-xs text-muted-foreground">
              Quality:{" "}
              <span className="text-foreground font-medium">
                {diagnosis.quality_status}
              </span>
            </p>
          </CardContent>
        </div>
      </Card>

      {/* Symptoms */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertCircle size={14} className="text-primary" />
            {t("detect.symptoms")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <ul
            className="space-y-1.5"
            data-ocid="diagnosis-result.symptoms.list"
          >
            {diagnosis.symptoms.map((sym, i) => (
              <li
                key={sym}
                className="flex items-start gap-2 text-sm text-foreground"
                data-ocid={`diagnosis-result.symptoms.item.${i + 1}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {sym}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Treatment */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle size={14} className="text-primary" />
            {t("detect.treatment")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            {diagnosis.treatment}
          </p>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            <div data-ocid="diagnosis-result.fertilizer.section">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sprout size={11} />
                {t("detect.fertilizer")}
              </p>
              <p className="text-sm text-foreground">
                {diagnosis.fertilizer_recommendation}
              </p>
            </div>
            <div data-ocid="diagnosis-result.pesticide.section">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FlaskConical size={11} />
                {t("detect.pesticide")}
              </p>
              <p className="text-sm text-foreground">
                {diagnosis.pesticide_recommendation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consult expert (only for high/critical) */}
      {needsExpert && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Checkbox
              id="consult-expert"
              checked={diagnosis.consult_expert}
              className="mt-0.5"
              data-ocid="diagnosis-result.consult_expert.checkbox"
            />
            <div>
              <label
                htmlFor="consult-expert"
                className="text-sm font-semibold text-foreground cursor-pointer"
              >
                {t("detect.consultExpert")}
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Severity is {conf.label.toLowerCase()} — professional assessment
                recommended.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div
        className="flex flex-wrap gap-3"
        data-ocid="diagnosis-result.actions"
      >
        <Button
          onClick={onSave}
          disabled={isSaving || isSaved}
          className="gap-2 flex-1 sm:flex-none"
          data-ocid="diagnosis-result.save.submit_button"
        >
          {isSaved ? (
            <>
              <CheckCircle size={15} />
              Saved
            </>
          ) : (
            <>
              <Save size={15} />
              {isSaving ? "Saving…" : "Save Diagnosis"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onDownload}
          className="gap-2 flex-1 sm:flex-none"
          data-ocid="diagnosis-result.download_button"
        >
          <Download size={15} />
          Download PDF
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          className="gap-2 flex-1 sm:flex-none text-muted-foreground"
          data-ocid="diagnosis-result.new_scan.button"
        >
          Scan Another
        </Button>
      </div>
    </div>
  );
}
