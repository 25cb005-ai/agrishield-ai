import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  isLoading?: boolean;
  ocid?: string;
}

export default function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  isLoading,
  ocid,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border" data-ocid={ocid}>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid={ocid}
    >
      <Card className="border-border hover:shadow-md transition-smooth group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-tight">
              {title}
            </p>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
              <Icon size={15} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          {trend && (
            <p
              className={`text-xs mt-1 font-medium ${trend.positive ? "text-primary" : "text-destructive"}`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% this week
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
