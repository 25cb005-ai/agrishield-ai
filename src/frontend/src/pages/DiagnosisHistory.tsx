import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  Leaf,
  ScanLine,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import { useLanguage } from "../context/LanguageContext";
import { type CropDiagnosis, Severity } from "../types";
import { formatDate, getSeverityClass, getSeverityLabel } from "../types";

// ─── Filter / Sort types ───────────────────────────────────────────────────

type SeverityFilter = "all" | Severity;
type SortOrder = "newest" | "oldest";

const SEVERITY_FILTERS: { value: SeverityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: Severity.low, label: "Low" },
  { value: Severity.moderate, label: "Moderate" },
  { value: Severity.high, label: "High" },
  { value: Severity.critical, label: "Critical" },
];

// ─── Skeleton loader ───────────────────────────────────────────────────────

function HistorySkeleton() {
  return (
    <div className="space-y-3" data-ocid="diagnosis-history.loading_state">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <Card
      className="border-border border-dashed"
      data-ocid="diagnosis-history.list.empty_state"
    >
      <CardContent className="p-14 flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ScanLine size={36} className="text-primary/60" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            Upload a crop photo to get your first AI diagnosis.
          </p>
        </div>
        <Button
          asChild
          className="gap-2 mt-2"
          data-ocid="diagnosis-history.detect_link"
        >
          <Link to="/detect">
            <Leaf size={16} />
            Detect Crop Disease
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Severity badge ────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSeverityClass(severity)}`}
    >
      {getSeverityLabel(severity)}
    </span>
  );
}

// ─── Confidence bar ────────────────────────────────────────────────────────

function ConfidenceBar({ value }: { value: bigint }) {
  const pct = Number(value);
  const color =
    pct >= 80 ? "bg-primary" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
        {pct}%
      </span>
    </div>
  );
}

// ─── Detail dialog ─────────────────────────────────────────────────────────

function DetailDialog({
  diagnosis,
  open,
  onClose,
}: {
  diagnosis: CropDiagnosis | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  if (!diagnosis) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[80vh] overflow-y-auto"
        data-ocid="diagnosis-history.detail.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Leaf size={20} className="text-primary" />
            {diagnosis.crop_name}
          </DialogTitle>
        </DialogHeader>

        {/* Header info */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <SeverityBadge severity={diagnosis.severity} />
          <span className="text-sm text-muted-foreground">
            {formatDate(diagnosis.created_at)}
          </span>
          {diagnosis.consult_expert && (
            <span className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full font-medium">
              <UserCheck size={12} />
              {t("detect.consultExpert")}
            </span>
          )}
        </div>

        {/* Disease + confidence */}
        <div className="bg-muted/40 rounded-xl p-4 space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {diagnosis.disease_name}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">
              {t("detect.confidence")}
            </span>
            <ConfidenceBar value={diagnosis.confidence} />
          </div>
          {diagnosis.quality_status && (
            <p className="text-xs text-muted-foreground">
              Quality: {diagnosis.quality_status}
            </p>
          )}
        </div>

        {/* Symptoms */}
        {diagnosis.symptoms.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              {t("detect.symptoms")}
            </h4>
            <ul className="space-y-1">
              {diagnosis.symptoms.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Treatment */}
        {diagnosis.treatment && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-primary" />
              {t("detect.treatment")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.treatment}
            </p>
          </div>
        )}

        {/* Fertilizer */}
        {diagnosis.fertilizer_recommendation && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              {t("detect.fertilizer")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.fertilizer_recommendation}
            </p>
          </div>
        )}

        {/* Pesticide */}
        {diagnosis.pesticide_recommendation && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">
              {t("detect.pesticide")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.pesticide_recommendation}
            </p>
          </div>
        )}

        {/* Notes */}
        {diagnosis.notes && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">Notes</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.notes}
            </p>
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            data-ocid="diagnosis-history.detail.close_button"
          >
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Diagnosis row card ────────────────────────────────────────────────────

function DiagnosisCard({
  diagnosis,
  index,
  onView,
  onDeleteRequest,
}: {
  diagnosis: CropDiagnosis;
  index: number;
  onView: (d: CropDiagnosis) => void;
  onDeleteRequest: (id: string) => void;
}) {
  return (
    <Card
      className="border-border hover:shadow-md transition-shadow duration-200 group cursor-pointer"
      data-ocid={`diagnosis-history.item.${index + 1}`}
      onClick={() => onView(diagnosis)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Leaf size={20} className="text-primary" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-sm truncate">
                {diagnosis.crop_name}
              </span>
              {diagnosis.consult_expert && (
                <AlertTriangle
                  size={13}
                  className="text-orange-500 shrink-0"
                  aria-label="Expert consultation advised"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {diagnosis.disease_name}
            </p>
            <div className="mt-2 w-32">
              <ConfidenceBar value={diagnosis.confidence} />
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <SeverityBadge severity={diagnosis.severity} />
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatDate(diagnosis.created_at)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(diagnosis.id);
              }}
              aria-label="Delete diagnosis"
              data-ocid={`diagnosis-history.delete_button.${index + 1}`}
            >
              <Trash2 size={15} />
            </Button>
            <ChevronRight
              size={16}
              className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function DiagnosisHistory() {
  const { t } = useLanguage();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedDiagnosis, setSelectedDiagnosis] =
    useState<CropDiagnosis | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ── Fetch diagnoses ──
  const {
    data: diagnoses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<CropDiagnosis[]>({
    queryKey: ["diagnoses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDiagnosesByUser();
    },
    enabled: !!actor && !actorFetching,
  });

  // ── Delete mutation ──
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteDiagnosis(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
    },
  });

  // ── Filter + Sort ──
  const filtered = diagnoses
    .filter((d) => severityFilter === "all" || d.severity === severityFilter)
    .sort((a, b) => {
      const diff = Number(b.created_at - a.created_at);
      return sortOrder === "newest" ? diff : -diff;
    });

  const handleDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
    setDeleteTargetId(null);
  };

  return (
    <div
      className="p-4 sm:p-6 space-y-5 max-w-3xl mx-auto"
      data-ocid="diagnosis-history.page"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("history.title")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your complete crop diagnosis records
        </p>
      </div>

      {/* Controls */}
      {!isLoading && diagnoses.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          {/* Severity filter */}
          <Select
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}
          >
            <SelectTrigger
              className="w-40"
              data-ocid="diagnosis-history.severity.select"
            >
              <SelectValue placeholder="Filter severity" />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.value === "all" ? "All Severities" : f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort order */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))
            }
            data-ocid="diagnosis-history.sort.toggle"
          >
            <ArrowUpDown size={14} />
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </Button>

          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Content */}
      {isLoading || actorFetching ? (
        <HistorySkeleton />
      ) : isError ? (
        <Card
          className="border-destructive/40"
          data-ocid="diagnosis-history.error_state"
        >
          <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={32} className="text-destructive" />
            <p className="text-foreground font-medium">{t("common.error")}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-ocid="diagnosis-history.retry_button"
            >
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        diagnoses.length === 0 ? (
          <EmptyState message={t("history.empty")} />
        ) : (
          <Card
            className="border-border border-dashed"
            data-ocid="diagnosis-history.filter.empty_state"
          >
            <CardContent className="p-10 flex flex-col items-center gap-2 text-center">
              <ScanLine size={28} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {t("common.noResults")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSeverityFilter("all")}
              >
                Clear filter
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="space-y-3" data-ocid="diagnosis-history.list">
          {filtered.map((diagnosis, i) => (
            <DiagnosisCard
              key={diagnosis.id}
              diagnosis={diagnosis}
              index={i}
              onView={setSelectedDiagnosis}
              onDeleteRequest={setDeleteTargetId}
            />
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <DetailDialog
        diagnosis={selectedDiagnosis}
        open={!!selectedDiagnosis}
        onClose={() => setSelectedDiagnosis(null)}
      />

      {/* Delete confirm dialog */}
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent data-ocid="diagnosis-history.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("history.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The diagnosis record will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="diagnosis-history.delete.cancel_button">
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              data-ocid="diagnosis-history.delete.confirm_button"
            >
              {deleteMutation.isPending ? "Deleting…" : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
