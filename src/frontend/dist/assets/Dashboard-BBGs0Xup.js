import { c as createLucideIcon, j as jsxRuntimeExports, m as motion, L as Link, C as Card, a as CardContent, b as Leaf, S as Skeleton, u as useLanguage, P as Package, d as ShoppingBag, e as Sprout, f as Camera, g as Cloud, B as Button } from "./index-Vk38G6iG.js";
import { B as Badge } from "./badge-BxaTeqsn.js";
import { g as getSeverityClass, a as getSeverityLabel, f as formatDate } from "./index-witveoCw.js";
import { u as useListDiagnoses, a as useListOrders, b as useListPesticides } from "./useQueries-C_ne3ThH.js";
import { O as OrderStatus } from "./backend-DMzQOyye.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode);
function QuickAction({
  icon: Icon,
  label,
  to,
  iconClass = "text-primary bg-primary/10",
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      whileHover: { y: -2, scale: 1.02 },
      whileTap: { scale: 0.97 },
      transition: { duration: 0.15 },
      "data-ocid": ocid,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border cursor-pointer hover:shadow-md hover:border-primary/30 transition-smooth h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex flex-col items-center gap-2.5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 21 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground leading-tight", children: label })
      ] }) }) })
    }
  );
}
function RecentDiagnosis({
  diagnosis,
  index
}) {
  const severityClass = getSeverityClass(diagnosis.severity);
  const severityLabel = getSeverityLabel(diagnosis.severity);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06, duration: 0.25 },
      className: "flex items-center gap-3 py-3 border-b border-border last:border-0",
      "data-ocid": `dashboard.recent-diagnosis.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center overflow-hidden", children: diagnosis.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: diagnosis.image_url,
            alt: diagnosis.crop_name,
            className: "w-full h-full object-cover rounded-lg"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 18, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate capitalize", children: diagnosis.crop_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: diagnosis.disease_name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-[10px] px-1.5 py-0 font-medium border-0 ${severityClass}`,
              children: severityLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: formatDate(diagnosis.created_at) })
        ] })
      ]
    }
  );
}
function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  isLoading,
  ocid
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", "data-ocid": ocid, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4 rounded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      "data-ocid": ocid,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border hover:shadow-md transition-smooth group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15, className: "text-primary" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground tabular-nums", children: value }),
        trend && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: `text-xs mt-1 font-medium ${trend.positive ? "text-primary" : "text-destructive"}`,
            children: [
              trend.positive ? "↑" : "↓",
              " ",
              Math.abs(trend.value),
              "% this week"
            ]
          }
        )
      ] }) })
    }
  );
}
function Dashboard() {
  const { t } = useLanguage();
  const { data: diagnoses, isLoading: loadingDiagnoses } = useListDiagnoses();
  const { data: orders, isLoading: loadingOrders } = useListOrders();
  const { data: pesticides, isLoading: loadingPesticides } = useListPesticides();
  const totalDiagnoses = (diagnoses == null ? void 0 : diagnoses.length) ?? 0;
  const pendingOrders = (orders == null ? void 0 : orders.filter(
    (o) => o.status === OrderStatus.pending || o.status === OrderStatus.confirmed
  ).length) ?? 0;
  const availablePesticides = (pesticides == null ? void 0 : pesticides.filter((p) => p.is_available).length) ?? 0;
  const recentDiagnoses = diagnoses ? [...diagnoses].sort((a, b) => Number(b.created_at - a.created_at)).slice(0, 5) : [];
  const stats = [
    {
      icon: Leaf,
      title: t("dashboard.stat.totalDiagnoses"),
      value: totalDiagnoses,
      isLoading: loadingDiagnoses,
      ocid: "dashboard.stat.item.1"
    },
    {
      icon: Package,
      title: t("dashboard.stat.pendingOrders"),
      value: pendingOrders,
      isLoading: loadingOrders,
      ocid: "dashboard.stat.item.2"
    },
    {
      icon: ShoppingBag,
      title: t("dashboard.stat.availablePesticides"),
      value: availablePesticides,
      isLoading: loadingPesticides,
      ocid: "dashboard.stat.item.3"
    },
    {
      icon: Sprout,
      title: t("dashboard.stat.activeSeeds"),
      value: 0,
      isLoading: false,
      ocid: "dashboard.stat.item.4"
    }
  ];
  const quickActions = [
    {
      icon: Camera,
      label: t("nav.detection"),
      to: "/detect",
      iconClass: "text-primary bg-primary/10",
      ocid: "dashboard.quick-action.detect.link"
    },
    {
      icon: History,
      label: t("nav.history"),
      to: "/history",
      iconClass: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      ocid: "dashboard.quick-action.history.link"
    },
    {
      icon: ShoppingBag,
      label: t("nav.shop"),
      to: "/shop",
      iconClass: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      ocid: "dashboard.quick-action.shop.link"
    },
    {
      icon: Cloud,
      label: t("nav.weather"),
      to: "/weather",
      iconClass: "text-sky-600 bg-sky-50 dark:bg-sky-900/20",
      ocid: "dashboard.quick-action.weather.link"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 sm:p-6 space-y-6 max-w-4xl mx-auto",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: t("dashboard.title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: t("dashboard.subtitle") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: stats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: i * 0.07, duration: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...stat })
          },
          stat.ocid
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: t("dashboard.quickActions") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { ...action }, action.to)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: t("dashboard.recentDiagnoses") }),
            totalDiagnoses > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/history",
                className: "text-xs text-primary font-medium hover:underline",
                "data-ocid": "dashboard.view-all-diagnoses.link",
                children: t("common.viewAll")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border-border",
              "data-ocid": "dashboard.recent-diagnoses.card",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: loadingDiagnoses ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "space-y-3",
                  "data-ocid": "dashboard.recent-diagnoses.loading_state",
                  children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted animate-pulse" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded animate-pulse w-28" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-muted rounded animate-pulse w-20" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-14 bg-muted rounded-full animate-pulse" })
                  ] }, i))
                }
              ) : recentDiagnoses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "py-10 flex flex-col items-center gap-3 text-center",
                  "data-ocid": "dashboard.recent-diagnoses.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 26, className: "text-primary/60" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No diagnoses yet" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Scan a crop to start tracking its health" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        asChild: true,
                        "data-ocid": "dashboard.scan-now.primary_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/detect", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 14, className: "mr-1.5" }),
                          "Scan Now"
                        ] })
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: recentDiagnoses.map((diagnosis, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                RecentDiagnosis,
                {
                  diagnosis,
                  index: i
                },
                diagnosis.id
              )) }) })
            }
          )
        ] })
      ]
    }
  );
}
export {
  Dashboard as default
};
