import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  CheckCircle,
  Leaf,
  Search,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { createActor } from "../backend";
import type { SeedBatch } from "../backend";
import { useLanguage } from "../context/LanguageContext";
import {
  CropCategory,
  HealthStatus,
  QualityGrade,
  formatDate,
  getCropCategoryLabel,
  getHealthStatusLabel,
  getQualityGradeLabel,
} from "../types";

// ─── helpers ────────────────────────────────────────────────────────────────

function getGerminationColor(rate: number): string {
  if (rate >= 85) return "bg-green-500";
  if (rate >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function getGerminationTextColor(rate: number): string {
  if (rate >= 85) return "text-green-600 dark:text-green-400";
  if (rate >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getQualityGradeBadgeClass(grade: QualityGrade): string {
  const map: Record<QualityGrade, string> = {
    [QualityGrade.aplus]:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [QualityGrade.a]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [QualityGrade.b]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [QualityGrade.c]:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    [QualityGrade.rejected]:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return map[grade] ?? "";
}

function getHealthStatusIcon(status: HealthStatus) {
  switch (status) {
    case HealthStatus.certified:
      return <CheckCircle size={16} className="text-green-500" />;
    case HealthStatus.treated:
      return <Leaf size={16} className="text-blue-500" />;
    case HealthStatus.untreated:
      return <AlertTriangle size={16} className="text-yellow-500" />;
    case HealthStatus.contaminated:
      return <XCircle size={16} className="text-red-500" />;
  }
}

function getHealthStatusBadgeClass(status: HealthStatus): string {
  const map: Record<HealthStatus, string> = {
    [HealthStatus.certified]:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [HealthStatus.treated]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [HealthStatus.untreated]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [HealthStatus.contaminated]:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return map[status] ?? "";
}

function getCropCategoryBadgeClass(category: CropCategory): string {
  const map: Record<CropCategory, string> = {
    [CropCategory.cereal]:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    [CropCategory.vegetable]:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [CropCategory.fruit]:
      "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    [CropCategory.pulse]:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    [CropCategory.oilseed]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [CropCategory.fiber]:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    [CropCategory.spice]:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    [CropCategory.other]: "bg-muted text-muted-foreground",
  };
  return map[category] ?? "";
}

// ─── ProgressBar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  colorClass: string;
}

function ProgressBar({ value, colorClass }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

// ─── ResultCard ─────────────────────────────────────────────────────────────

interface ResultCardProps {
  batch: SeedBatch;
}

function ResultCard({ batch }: ResultCardProps) {
  const { t } = useLanguage();
  const germinationRate = Number(batch.germination_rate);
  const purityPct = Number(batch.purity_percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        className="border-border shadow-sm overflow-hidden"
        data-ocid="seed-verification.result.card"
      >
        {/* Header strip */}
        <div className="bg-primary/10 border-b border-border px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Leaf size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {t("seeds.batchNumber")}
            </p>
            <p className="font-display text-lg font-bold text-foreground truncate">
              {batch.batch_number}
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <CheckCircle size={22} className="text-primary" />
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Top meta row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {t("seeds.manufacturer")}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {batch.manufacturer}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Seed Type</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {batch.seed_type}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Certified Date
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(batch.certified_date)}
              </p>
            </div>
          </div>

          {/* Category + Grade + Health badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getCropCategoryBadgeClass(batch.crop_category)}`}
              data-ocid="seed-verification.result.category"
            >
              {getCropCategoryLabel(batch.crop_category)}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getQualityGradeBadgeClass(batch.quality_grade)}`}
              data-ocid="seed-verification.result.quality_grade"
            >
              {t("seeds.grade")}: {getQualityGradeLabel(batch.quality_grade)}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getHealthStatusBadgeClass(batch.health_status)}`}
              data-ocid="seed-verification.result.health_status"
            >
              {getHealthStatusIcon(batch.health_status)}
              {getHealthStatusLabel(batch.health_status)}
            </span>
          </div>

          {/* Germination Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {t("seeds.germination")}
              </p>
              <span
                className={`text-sm font-bold ${getGerminationTextColor(germinationRate)}`}
              >
                {germinationRate}%
              </span>
            </div>
            <ProgressBar
              value={germinationRate}
              colorClass={getGerminationColor(germinationRate)}
            />
            <p className="text-xs text-muted-foreground">
              {germinationRate >= 85
                ? "Excellent germination rate"
                : germinationRate >= 70
                  ? "Acceptable germination rate"
                  : "Below recommended threshold"}
            </p>
          </div>

          {/* Purity Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {t("seeds.purity")}
              </p>
              <span className="text-sm font-bold text-primary">
                {purityPct}%
              </span>
            </div>
            <ProgressBar value={purityPct} colorClass="bg-primary" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type SearchState = "idle" | "loading" | "found" | "not_found" | "error";

const SAMPLE_BATCHES = ["SB-001", "SB-002", "SB-003"];

export default function SeedVerification() {
  const { t } = useLanguage();
  const { actor, isFetching } = useActor(createActor);

  const [batchNumber, setBatchNumber] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [result, setResult] = useState<SeedBatch | null>(null);
  const [searchedBatch, setSearchedBatch] = useState("");

  async function handleSearch(query?: string) {
    const value = (query ?? batchNumber).trim();
    if (!value || !actor) return;
    setSearchedBatch(value);
    setSearchState("loading");
    setResult(null);
    try {
      const batch = await actor.getSeedBatch(value);
      if (batch) {
        setResult(batch);
        setSearchState("found");
      } else {
        setSearchState("not_found");
      }
    } catch {
      setSearchState("error");
    }
  }

  function handleChipClick(chip: string) {
    setBatchNumber(chip);
    handleSearch(chip);
  }

  const isActorReady = !!actor && !isFetching;

  return (
    <div
      className="p-4 sm:p-6 space-y-6 max-w-2xl mx-auto"
      data-ocid="seed-verification.page"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("seeds.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify seed quality and authenticity by batch number
        </p>
      </div>

      {/* Search bar */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                data-ocid="seed-verification.search_input"
                className="pl-9"
                placeholder={t("seeds.search")}
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                disabled={!isActorReady}
                aria-label={t("seeds.batchNumber")}
              />
            </div>
            <Button
              data-ocid="seed-verification.search.submit_button"
              onClick={() => handleSearch()}
              disabled={!isActorReady || !batchNumber.trim()}
              className="shrink-0 transition-smooth"
            >
              <Search size={16} className="mr-1.5" />
              {t("common.search")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {searchState === "loading" && (
        <Card
          className="border-border"
          data-ocid="seed-verification.loading_state"
        >
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      )}

      {/* Found result */}
      {searchState === "found" && result && <ResultCard batch={result} />}

      {/* Not found state */}
      {searchState === "not_found" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="border-border"
            data-ocid="seed-verification.not_found.error_state"
          >
            <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle size={24} className="text-destructive" />
              </div>
              <p className="font-semibold text-foreground">Batch not found</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                No seed batch found for{" "}
                <span className="font-mono font-semibold text-foreground">
                  {searchedBatch}
                </span>
                . Please check and try again.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error state */}
      {searchState === "error" && (
        <Card
          className="border-border"
          data-ocid="seed-verification.error_state"
        >
          <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={32} className="text-destructive" />
            <p className="text-sm text-muted-foreground">{t("common.error")}</p>
            <Button
              variant="outline"
              size="sm"
              data-ocid="seed-verification.retry.secondary_button"
              onClick={() => handleSearch()}
            >
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty / idle state — before search */}
      {searchState === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="border-border bg-muted/30"
            data-ocid="seed-verification.idle.empty_state"
          >
            <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Leaf size={28} className="text-primary" />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-foreground">
                  Verify Seed Quality
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a batch number to verify seed quality and authenticity.
                </p>
              </div>
              {/* Sample chips */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <p className="text-xs text-muted-foreground">
                  Try a sample batch:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SAMPLE_BATCHES.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      data-ocid="seed-verification.sample.button"
                      className="px-3 py-1.5 rounded-full border border-border bg-card text-xs font-mono font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => handleChipClick(chip)}
                      disabled={!isActorReady}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
