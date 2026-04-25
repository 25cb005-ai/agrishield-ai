import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { OrderStatus } from "../backend";
import { useLanguage } from "../context/LanguageContext";
import { useListOrders } from "../hooks/useQueries";
import { formatDate, formatPrice, getStatusLabel } from "../types";
import type { Order } from "../types";

// ─── Status config ────────────────────────────────────────────────────────────

type StatusFilter = "all" | OrderStatus;
type SortDir = "newest" | "oldest";

interface StatusConfig {
  badgeClass: string;
  icon: React.ReactNode;
  timelineStep: number;
}

function getStatusConfig(status: OrderStatus): StatusConfig {
  switch (status) {
    case OrderStatus.pending:
      return {
        badgeClass:
          "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
        icon: <Package className="w-3.5 h-3.5" />,
        timelineStep: 0,
      };
    case OrderStatus.confirmed:
      return {
        badgeClass:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
        icon: <PackageCheck className="w-3.5 h-3.5" />,
        timelineStep: 1,
      };
    case OrderStatus.shipped:
      return {
        badgeClass:
          "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
        icon: <Truck className="w-3.5 h-3.5" />,
        timelineStep: 2,
      };
    case OrderStatus.delivered:
      return {
        badgeClass:
          "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        timelineStep: 3,
      };
    case OrderStatus.cancelled:
      return {
        badgeClass:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
        icon: <XCircle className="w-3.5 h-3.5" />,
        timelineStep: -1,
      };
  }
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { label: "Order Placed", Icon: Package },
  { label: "Confirmed", Icon: PackageCheck },
  { label: "Shipped", Icon: Truck },
  { label: "Delivered", Icon: CheckCircle2 },
];

function OrderTimeline({ status }: { status: OrderStatus }) {
  const { timelineStep } = getStatusConfig(status);
  const isCancelled = status === OrderStatus.cancelled;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Order Timeline
      </p>
      {isCancelled ? (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <XCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Order Cancelled</span>
        </div>
      ) : (
        <div className="flex items-center">
          {TIMELINE_STEPS.map((step) => {
            const { Icon, label } = step;
            const idx = TIMELINE_STEPS.findIndex((s) => s.label === label);
            const done = idx <= timelineStep;
            const active = idx === timelineStep;
            return (
              <div
                key={label}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                    } ${active ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] font-medium text-center leading-tight w-14 ${
                      done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mb-5 mx-1 transition-all ${
                      idx < timelineStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Order detail (expandable) ────────────────────────────────────────────────

function OrderDetail({ order }: { order: Order }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
        {/* Items table */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("orders.items")}
          </p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                    Qty
                  </th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.pesticide_id} className="bg-card">
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">
                      {Number(item.quantity)} {item.unit}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-foreground">
                      {formatPrice(item.price * Number(item.quantity))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-border bg-muted/30">
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-2.5 text-right font-semibold text-foreground"
                  >
                    {t("orders.total")}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-primary">
                    {formatPrice(order.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Delivery info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {t("orders.address")}
            </p>
            <p className="text-sm text-foreground leading-relaxed break-words">
              {order.delivery_address || "—"}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Phone
            </p>
            <p className="text-sm text-foreground">{order.phone || "—"}</p>
            {order.notes && (
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1">
                  Notes
                </p>
                <p className="text-sm text-foreground">{order.notes}</p>
              </>
            )}
          </div>
        </div>

        {/* Order timeline */}
        <OrderTimeline status={order.status} />
      </div>
    </motion.div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = getStatusConfig(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      data-ocid={`orders.item.${index + 1}`}
    >
      <Card className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
        <button
          type="button"
          className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-muted/20 transition-colors"
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`orders.expand_button.${index + 1}`}
          aria-expanded={expanded}
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-semibold text-foreground">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 px-2 py-0.5 font-medium border ${cfg.badgeClass}`}
                data-ocid={`orders.status_badge.${index + 1}`}
              >
                {cfg.icon}
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
              <span>
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </span>
              <span className="opacity-40">·</span>
              <span className="font-semibold text-foreground">
                {formatPrice(order.total_amount)}
              </span>
              <span className="opacity-40">·</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>

          <div className="shrink-0 text-muted-foreground">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && <OrderDetail key="detail" order={order} />}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function OrdersSkeleton() {
  return (
    <div className="space-y-3" data-ocid="orders.loading_state">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border p-4 flex items-center gap-3 bg-card"
        >
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Filter pill options ──────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.confirmed, label: "Confirmed" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyOrders() {
  const { t } = useLanguage();
  const { data: orders, isLoading, isError, refetch } = useListOrders();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortDir, setSortDir] = useState<SortDir>("newest");

  const filteredOrders = useMemo(() => {
    let list = orders ?? [];
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    return [...list].sort((a, b) => {
      const diff = Number(b.created_at - a.created_at);
      return sortDir === "newest" ? diff : -diff;
    });
  }, [orders, statusFilter, sortDir]);

  return (
    <div className="min-h-full bg-background" data-ocid="orders.page">
      {/* Sticky header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-foreground font-display">
                {t("orders.title")}
              </h1>
              {orders && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                  total
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortDir((d) => (d === "newest" ? "oldest" : "newest"))
              }
              data-ocid="orders.sort_toggle"
              className="text-xs"
            >
              {sortDir === "newest" ? "Newest first" : "Oldest first"}
            </Button>
          </div>

          {/* Status filter pills */}
          <div
            className="flex gap-1.5 mt-3 flex-wrap"
            data-ocid="orders.filter.tab"
            role="tablist"
          >
            {FILTER_OPTIONS.map((opt) => {
              const active = statusFilter === opt.value;
              const count =
                opt.value === "all"
                  ? (orders?.length ?? 0)
                  : (orders?.filter((o) => o.status === opt.value).length ?? 0);
              return (
                <button
                  type="button"
                  key={opt.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(opt.value)}
                  data-ocid={`orders.filter.${opt.value}`}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  <span
                    className={`text-[10px] ${active ? "opacity-80" : "opacity-60"}`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {isLoading && <OrdersSkeleton />}

        {isError && !isLoading && (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
            data-ocid="orders.error_state"
          >
            <XCircle className="w-8 h-8 text-destructive mx-auto mb-3 opacity-70" />
            <p className="text-sm font-medium text-foreground mb-1">
              {t("common.error")}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Could not load your orders. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-ocid="orders.retry_button"
            >
              {t("common.retry")}
            </Button>
          </div>
        )}

        {!isLoading && !isError && orders?.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="orders.empty_state"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <ShoppingBag className="w-10 h-10 text-primary/60" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Visit the Pesticide Shop to place your first order.
            </p>
            <Link to="/shop">
              <Button variant="default" data-ocid="orders.shop_link_button">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Go to Pesticide Shop
              </Button>
            </Link>
          </div>
        )}

        {!isLoading &&
          !isError &&
          orders &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="orders.filter_empty_state"
            >
              <Package className="w-10 h-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No orders with this status.
              </p>
              <button
                type="button"
                className="mt-3 text-xs text-primary hover:underline"
                onClick={() => setStatusFilter("all")}
                data-ocid="orders.clear_filter_button"
              >
                Clear filter
              </button>
            </div>
          )}

        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="space-y-3" data-ocid="orders.list">
            {filteredOrders.map((order, idx) => (
              <OrderCard key={order.id} order={order} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
