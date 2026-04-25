import { c as createLucideIcon, u as useLanguage, r as reactExports, j as jsxRuntimeExports, B as Button, d as ShoppingBag, L as Link, P as Package, S as Skeleton, m as motion, C as Card, aa as AnimatePresence } from "./index-Vk38G6iG.js";
import { B as Badge } from "./badge-BxaTeqsn.js";
import { O as OrderStatus } from "./backend-DMzQOyye.js";
import { a as useListOrders } from "./useQueries-C_ne3ThH.js";
import { i as getStatusLabel, b as formatPrice, f as formatDate } from "./index-witveoCw.js";
import { C as CircleX } from "./circle-x-xhujiMNN.js";
import { a as ChevronUp, C as ChevronDown, b as CircleCheck } from "./circle-check-DG0CR0Nl.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackageCheck = createLucideIcon("package-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
function getStatusConfig(status) {
  switch (status) {
    case OrderStatus.pending:
      return {
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3.5 h-3.5" }),
        timelineStep: 0
      };
    case OrderStatus.confirmed:
      return {
        badgeClass: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { className: "w-3.5 h-3.5" }),
        timelineStep: 1
      };
    case OrderStatus.shipped:
      return {
        badgeClass: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-3.5 h-3.5" }),
        timelineStep: 2
      };
    case OrderStatus.delivered:
      return {
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
        timelineStep: 3
      };
    case OrderStatus.cancelled:
      return {
        badgeClass: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
        timelineStep: -1
      };
  }
}
const TIMELINE_STEPS = [
  { label: "Order Placed", Icon: Package },
  { label: "Confirmed", Icon: PackageCheck },
  { label: "Shipped", Icon: Truck },
  { label: "Delivered", Icon: CircleCheck }
];
function OrderTimeline({ status }) {
  const { timelineStep } = getStatusConfig(status);
  const isCancelled = status === OrderStatus.cancelled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Order Timeline" }),
    isCancelled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-red-600 dark:text-red-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Order Cancelled" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: TIMELINE_STEPS.map((step) => {
      const { Icon, label } = step;
      const idx = TIMELINE_STEPS.findIndex((s) => s.label === label);
      const done = idx <= timelineStep;
      const active = idx === timelineStep;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center flex-1 last:flex-none",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"} ${active ? "ring-2 ring-primary/30 ring-offset-2" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `mt-1.5 text-[10px] font-medium text-center leading-tight w-14 ${done ? "text-foreground" : "text-muted-foreground"}`,
                  children: step.label
                }
              )
            ] }),
            idx < TIMELINE_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex-1 h-0.5 mb-5 mx-1 transition-all ${idx < timelineStep ? "bg-primary" : "bg-border"}`
              }
            )
          ]
        },
        label
      );
    }) })
  ] });
}
function OrderDetail({ order }) {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.2, ease: "easeInOut" },
      className: "overflow-hidden",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-2 border-t border-border space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: t("orders.items") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium text-muted-foreground", children: "Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium text-muted-foreground", children: "Qty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium text-muted-foreground", children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium text-muted-foreground", children: "Subtotal" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-medium text-foreground", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 text-right text-muted-foreground", children: [
                Number(item.quantity),
                " ",
                item.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right text-muted-foreground", children: formatPrice(item.price) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-semibold text-foreground", children: formatPrice(item.price * Number(item.quantity)) })
            ] }, item.pesticide_id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "border-t border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  colSpan: 3,
                  className: "px-3 py-2.5 text-right font-semibold text-foreground",
                  children: t("orders.total")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-bold text-primary", children: formatPrice(order.total_amount) })
            ] }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: t("orders.address") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed break-words", children: order.delivery_address || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: order.phone || "—" }),
            order.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: order.notes })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OrderTimeline, { status: order.status })
      ] })
    }
  );
}
function OrderCard({ order, index }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const cfg = getStatusConfig(order.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.22, delay: index * 0.06 },
      "data-ocid": `orders.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-muted/20 transition-colors",
            onClick: () => setExpanded((v) => !v),
            "data-ocid": `orders.expand_button.${index + 1}`,
            "aria-expanded": expanded,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-foreground", children: [
                    "#",
                    order.id.slice(0, 8).toUpperCase()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs flex items-center gap-1 px-2 py-0.5 font-medium border ${cfg.badgeClass}`,
                      "data-ocid": `orders.status_badge.${index + 1}`,
                      children: [
                        cfg.icon,
                        getStatusLabel(order.status)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    order.items.length,
                    " ",
                    order.items.length === 1 ? "item" : "items"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatPrice(order.total_amount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(order.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-muted-foreground", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderDetail, { order }, "detail") })
      ] })
    }
  );
}
function OrdersSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "orders.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border p-4 flex items-center gap-3 bg-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full" })
      ]
    },
    i
  )) });
}
const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.confirmed, label: "Confirmed" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" }
];
function MyOrders() {
  const { t } = useLanguage();
  const { data: orders, isLoading, isError, refetch } = useListOrders();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [sortDir, setSortDir] = reactExports.useState("newest");
  const filteredOrders = reactExports.useMemo(() => {
    let list = orders ?? [];
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    return [...list].sort((a, b) => {
      const diff = Number(b.created_at - a.created_at);
      return sortDir === "newest" ? diff : -diff;
    });
  }, [orders, statusFilter, sortDir]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full bg-background", "data-ocid": "orders.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 sm:px-6 py-5 sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: t("orders.title") }),
          orders && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
            orders.length,
            " ",
            orders.length === 1 ? "order" : "orders",
            " ",
            "total"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setSortDir((d) => d === "newest" ? "oldest" : "newest"),
            "data-ocid": "orders.sort_toggle",
            className: "text-xs",
            children: sortDir === "newest" ? "Newest first" : "Oldest first"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1.5 mt-3 flex-wrap",
          "data-ocid": "orders.filter.tab",
          role: "tablist",
          children: FILTER_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
            const count = opt.value === "all" ? (orders == null ? void 0 : orders.length) ?? 0 : (orders == null ? void 0 : orders.filter((o) => o.status === opt.value).length) ?? 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": active,
                onClick: () => setStatusFilter(opt.value),
                "data-ocid": `orders.filter.${opt.value}`,
                className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"}`,
                children: [
                  opt.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `text-[10px] ${active ? "opacity-80" : "opacity-60"}`,
                      children: [
                        "(",
                        count,
                        ")"
                      ]
                    }
                  )
                ]
              },
              opt.value
            );
          })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-6", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersSkeleton, {}),
      isError && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center",
          "data-ocid": "orders.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-8 h-8 text-destructive mx-auto mb-3 opacity-70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: t("common.error") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Could not load your orders. Please try again." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => refetch(),
                "data-ocid": "orders.retry_button",
                children: t("common.retry")
              }
            )
          ]
        }
      ),
      !isLoading && !isError && (orders == null ? void 0 : orders.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-20 text-center",
          "data-ocid": "orders.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-10 h-10 text-primary/60" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground mb-2", children: "No orders yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed", children: "Visit the Pesticide Shop to place your first order." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", "data-ocid": "orders.shop_link_button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 mr-2" }),
              "Go to Pesticide Shop"
            ] }) })
          ]
        }
      ),
      !isLoading && !isError && orders && orders.length > 0 && filteredOrders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 text-center",
          "data-ocid": "orders.filter_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10 text-muted-foreground/40 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No orders with this status." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mt-3 text-xs text-primary hover:underline",
                onClick: () => setStatusFilter("all"),
                "data-ocid": "orders.clear_filter_button",
                children: "Clear filter"
              }
            )
          ]
        }
      ),
      !isLoading && !isError && filteredOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "orders.list", children: filteredOrders.map((order, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order, index: idx }, order.id)) })
    ] })
  ] });
}
export {
  MyOrders as default
};
