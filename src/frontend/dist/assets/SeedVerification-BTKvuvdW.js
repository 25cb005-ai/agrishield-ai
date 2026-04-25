import { u as useLanguage, r as reactExports, j as jsxRuntimeExports, C as Card, a as CardContent, B as Button, q as CardHeader, S as Skeleton, m as motion, b as Leaf } from "./index-Vk38G6iG.js";
import { I as Input } from "./input-JoH_8Rfw.js";
import { u as useActor, H as HealthStatus, C as CropCategory, Q as QualityGrade, c as createActor } from "./backend-DMzQOyye.js";
import { f as formatDate, d as getCropCategoryLabel, e as getQualityGradeLabel, h as getHealthStatusLabel } from "./index-witveoCw.js";
import { S as Search } from "./search-DKwMQIL6.js";
import { C as CircleX } from "./circle-x-xhujiMNN.js";
import { T as TriangleAlert } from "./triangle-alert-CDCxeIsd.js";
import { C as CircleCheckBig } from "./circle-check-big-gi55uF63.js";
function getGerminationColor(rate) {
  if (rate >= 85) return "bg-green-500";
  if (rate >= 70) return "bg-yellow-500";
  return "bg-red-500";
}
function getGerminationTextColor(rate) {
  if (rate >= 85) return "text-green-600 dark:text-green-400";
  if (rate >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}
function getQualityGradeBadgeClass(grade) {
  const map = {
    [QualityGrade.aplus]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [QualityGrade.a]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [QualityGrade.b]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [QualityGrade.c]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    [QualityGrade.rejected]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };
  return map[grade] ?? "";
}
function getHealthStatusIcon(status) {
  switch (status) {
    case HealthStatus.certified:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16, className: "text-green-500" });
    case HealthStatus.treated:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 16, className: "text-blue-500" });
    case HealthStatus.untreated:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, className: "text-yellow-500" });
    case HealthStatus.contaminated:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16, className: "text-red-500" });
  }
}
function getHealthStatusBadgeClass(status) {
  const map = {
    [HealthStatus.certified]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [HealthStatus.treated]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    [HealthStatus.untreated]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [HealthStatus.contaminated]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };
  return map[status] ?? "";
}
function getCropCategoryBadgeClass(category) {
  const map = {
    [CropCategory.cereal]: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    [CropCategory.vegetable]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    [CropCategory.fruit]: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    [CropCategory.pulse]: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    [CropCategory.oilseed]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    [CropCategory.fiber]: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    [CropCategory.spice]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    [CropCategory.other]: "bg-muted text-muted-foreground"
  };
  return map[category] ?? "";
}
function ProgressBar({ value, colorClass }) {
  const clamped = Math.min(100, Math.max(0, value));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: `h-full rounded-full ${colorClass}`,
      initial: { width: 0 },
      animate: { width: `${clamped}%` },
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
    }
  ) });
}
function ResultCard({ batch }) {
  const { t } = useLanguage();
  const germinationRate = Number(batch.germination_rate);
  const purityPct = Number(batch.purity_percentage);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border shadow-sm overflow-hidden",
          "data-ocid": "seed-verification.result.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border-b border-border px-6 py-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 18, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium", children: t("seeds.batchNumber") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold text-foreground truncate", children: batch.batch_number })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 22, className: "text-primary" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: t("seeds.manufacturer") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: batch.manufacturer })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Seed Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: batch.seed_type })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Certified Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatDate(batch.certified_date) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getCropCategoryBadgeClass(batch.crop_category)}`,
                    "data-ocid": "seed-verification.result.category",
                    children: getCropCategoryLabel(batch.crop_category)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getQualityGradeBadgeClass(batch.quality_grade)}`,
                    "data-ocid": "seed-verification.result.quality_grade",
                    children: [
                      t("seeds.grade"),
                      ": ",
                      getQualityGradeLabel(batch.quality_grade)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getHealthStatusBadgeClass(batch.health_status)}`,
                    "data-ocid": "seed-verification.result.health_status",
                    children: [
                      getHealthStatusIcon(batch.health_status),
                      getHealthStatusLabel(batch.health_status)
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("seeds.germination") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `text-sm font-bold ${getGerminationTextColor(germinationRate)}`,
                      children: [
                        germinationRate,
                        "%"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressBar,
                  {
                    value: germinationRate,
                    colorClass: getGerminationColor(germinationRate)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: germinationRate >= 85 ? "Excellent germination rate" : germinationRate >= 70 ? "Acceptable germination rate" : "Below recommended threshold" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("seeds.purity") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-primary", children: [
                    purityPct,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: purityPct, colorClass: "bg-primary" })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
const SAMPLE_BATCHES = ["SB-001", "SB-002", "SB-003"];
function SeedVerification() {
  const { t } = useLanguage();
  const { actor, isFetching } = useActor(createActor);
  const [batchNumber, setBatchNumber] = reactExports.useState("");
  const [searchState, setSearchState] = reactExports.useState("idle");
  const [result, setResult] = reactExports.useState(null);
  const [searchedBatch, setSearchedBatch] = reactExports.useState("");
  async function handleSearch(query) {
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
  function handleChipClick(chip) {
    setBatchNumber(chip);
    handleSearch(chip);
  }
  const isActorReady = !!actor && !isFetching;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 sm:p-6 space-y-6 max-w-2xl mx-auto",
      "data-ocid": "seed-verification.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: t("seeds.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Verify seed quality and authenticity by batch number" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                size: 16,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "seed-verification.search_input",
                className: "pl-9",
                placeholder: t("seeds.search"),
                value: batchNumber,
                onChange: (e) => setBatchNumber(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleSearch();
                },
                disabled: !isActorReady,
                "aria-label": t("seeds.batchNumber")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "seed-verification.search.submit_button",
              onClick: () => handleSearch(),
              disabled: !isActorReady || !batchNumber.trim(),
              className: "shrink-0 transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "mr-1.5" }),
                t("common.search")
              ]
            }
          )
        ] }) }) }),
        searchState === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border",
            "data-ocid": "seed-verification.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/4" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full" })
              ] })
            ]
          }
        ),
        searchState === "found" && result && /* @__PURE__ */ jsxRuntimeExports.jsx(ResultCard, { batch: result }),
        searchState === "not_found" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border",
                "data-ocid": "seed-verification.not_found.error_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-10 flex flex-col items-center gap-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 24, className: "text-destructive" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Batch not found" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground max-w-xs", children: [
                    "No seed batch found for",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: searchedBatch }),
                    ". Please check and try again."
                  ] })
                ] })
              }
            )
          }
        ),
        searchState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border-border",
            "data-ocid": "seed-verification.error_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-10 flex flex-col items-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 32, className: "text-destructive" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("common.error") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  "data-ocid": "seed-verification.retry.secondary_button",
                  onClick: () => handleSearch(),
                  children: t("common.retry")
                }
              )
            ] })
          }
        ),
        searchState === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border bg-muted/30",
                "data-ocid": "seed-verification.idle.empty_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-10 flex flex-col items-center gap-4 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 28, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Verify Seed Quality" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Enter a batch number to verify seed quality and authenticity." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Try a sample batch:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2", children: SAMPLE_BATCHES.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "seed-verification.sample.button",
                        className: "px-3 py-1.5 rounded-full border border-border bg-card text-xs font-mono font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        onClick: () => handleChipClick(chip),
                        disabled: !isActorReady,
                        children: chip
                      },
                      chip
                    )) })
                  ] })
                ] })
              }
            )
          }
        )
      ]
    }
  );
}
export {
  SeedVerification as default
};
