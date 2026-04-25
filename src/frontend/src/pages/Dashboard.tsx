import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  Cloud,
  History,
  Leaf,
  Package,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import { motion } from "motion/react";
import QuickAction from "../components/dashboard/QuickAction";
import RecentDiagnosis from "../components/dashboard/RecentDiagnosis";
import StatCard from "../components/dashboard/StatCard";
import { useLanguage } from "../context/LanguageContext";
import {
  useListDiagnoses,
  useListOrders,
  useListPesticides,
} from "../hooks/useQueries";
import { OrderStatus } from "../types";

export default function Dashboard() {
  const { t } = useLanguage();

  const { data: diagnoses, isLoading: loadingDiagnoses } = useListDiagnoses();
  const { data: orders, isLoading: loadingOrders } = useListOrders();
  const { data: pesticides, isLoading: loadingPesticides } =
    useListPesticides();

  const totalDiagnoses = diagnoses?.length ?? 0;
  const pendingOrders =
    orders?.filter(
      (o) =>
        o.status === OrderStatus.pending || o.status === OrderStatus.confirmed,
    ).length ?? 0;
  const availablePesticides =
    pesticides?.filter((p) => p.is_available).length ?? 0;
  const recentDiagnoses = diagnoses
    ? [...diagnoses]
        .sort((a, b) => Number(b.created_at - a.created_at))
        .slice(0, 5)
    : [];

  const stats = [
    {
      icon: Leaf,
      title: t("dashboard.stat.totalDiagnoses"),
      value: totalDiagnoses,
      isLoading: loadingDiagnoses,
      ocid: "dashboard.stat.item.1",
    },
    {
      icon: Package,
      title: t("dashboard.stat.pendingOrders"),
      value: pendingOrders,
      isLoading: loadingOrders,
      ocid: "dashboard.stat.item.2",
    },
    {
      icon: ShoppingBag,
      title: t("dashboard.stat.availablePesticides"),
      value: availablePesticides,
      isLoading: loadingPesticides,
      ocid: "dashboard.stat.item.3",
    },
    {
      icon: Sprout,
      title: t("dashboard.stat.activeSeeds"),
      value: 0,
      isLoading: false,
      ocid: "dashboard.stat.item.4",
    },
  ];

  const quickActions = [
    {
      icon: Camera,
      label: t("nav.detection"),
      to: "/detect",
      iconClass: "text-primary bg-primary/10",
      ocid: "dashboard.quick-action.detect.link",
    },
    {
      icon: History,
      label: t("nav.history"),
      to: "/history",
      iconClass: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      ocid: "dashboard.quick-action.history.link",
    },
    {
      icon: ShoppingBag,
      label: t("nav.shop"),
      to: "/shop",
      iconClass: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      ocid: "dashboard.quick-action.shop.link",
    },
    {
      icon: Cloud,
      label: t("nav.weather"),
      to: "/weather",
      iconClass: "text-sky-600 bg-sky-50 dark:bg-sky-900/20",
      ocid: "dashboard.quick-action.weather.link",
    },
  ];

  return (
    <div
      className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto"
      data-ocid="dashboard.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("dashboard.title")}
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {t("dashboard.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.ocid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <QuickAction key={action.to} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Diagnoses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("dashboard.recentDiagnoses")}
          </h2>
          {totalDiagnoses > 0 && (
            <Link
              to="/history"
              className="text-xs text-primary font-medium hover:underline"
              data-ocid="dashboard.view-all-diagnoses.link"
            >
              {t("common.viewAll")}
            </Link>
          )}
        </div>

        <Card
          className="border-border"
          data-ocid="dashboard.recent-diagnoses.card"
        >
          <CardContent className="p-4">
            {loadingDiagnoses ? (
              <div
                className="space-y-3"
                data-ocid="dashboard.recent-diagnoses.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted rounded animate-pulse w-28" />
                      <div className="h-2.5 bg-muted rounded animate-pulse w-20" />
                    </div>
                    <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            ) : recentDiagnoses.length === 0 ? (
              <div
                className="py-10 flex flex-col items-center gap-3 text-center"
                data-ocid="dashboard.recent-diagnoses.empty_state"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf size={26} className="text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No diagnoses yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Scan a crop to start tracking its health
                  </p>
                </div>
                <Button
                  size="sm"
                  asChild
                  data-ocid="dashboard.scan-now.primary_button"
                >
                  <Link to="/detect">
                    <Camera size={14} className="mr-1.5" />
                    Scan Now
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                {recentDiagnoses.map((diagnosis, i) => (
                  <RecentDiagnosis
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    index={i}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
