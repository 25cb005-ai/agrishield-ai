import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  to: string;
  iconClass?: string;
  ocid?: string;
}

export default function QuickAction({
  icon: Icon,
  label,
  to,
  iconClass = "text-primary bg-primary/10",
  ocid,
}: QuickActionProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      data-ocid={ocid}
    >
      <Link to={to}>
        <Card className="border-border cursor-pointer hover:shadow-md hover:border-primary/30 transition-smooth h-full">
          <CardContent className="p-4 flex flex-col items-center gap-2.5 text-center">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
            >
              <Icon size={21} />
            </div>
            <span className="text-xs font-semibold text-foreground leading-tight">
              {label}
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
