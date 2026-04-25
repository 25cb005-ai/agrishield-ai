import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart2,
  Camera,
  Clock,
  Cloud,
  Home,
  Leaf,
  Package,
  Settings,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { to: "/", icon: Home, labelKey: "nav.dashboard" as const },
  { to: "/detect", icon: Camera, labelKey: "nav.detection" as const },
  { to: "/history", icon: Clock, labelKey: "nav.history" as const },
  { to: "/shop", icon: ShoppingBag, labelKey: "nav.shop" as const },
  { to: "/seeds", icon: Sprout, labelKey: "nav.seeds" as const },
  { to: "/weather", icon: Cloud, labelKey: "nav.weather" as const },
  { to: "/orders", icon: Package, labelKey: "nav.orders" as const },
  { to: "/settings", icon: Settings, labelKey: "nav.settings" as const },
];

export default function Sidebar() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-[260px] shrink-0 h-screen sticky top-0"
      style={{
        backgroundColor: "oklch(0.18 0.04 150)",
        color: "oklch(0.92 0.01 0)",
      }}
      data-ocid="sidebar.panel"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: "oklch(0.24 0.05 150)" }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary shadow-md">
          <Leaf size={20} className="text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p
            className="font-display font-bold text-base leading-tight truncate"
            style={{ color: "oklch(0.92 0.01 0)" }}
          >
            AgriShield AI
          </p>
          <p
            className="text-xs leading-tight truncate"
            style={{ color: "oklch(0.65 0.04 150)" }}
          >
            Smart Crop Health
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, labelKey }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  data-ocid={`sidebar.${labelKey.split(".")[1]}.link`}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-white/10",
                  ].join(" ")}
                  style={isActive ? {} : { color: "oklch(0.75 0.03 150)" }}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{t(labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Language switcher */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: "oklch(0.24 0.05 150)" }}
      >
        <p
          className="text-xs mb-2 font-medium"
          style={{ color: "oklch(0.55 0.04 150)" }}
        >
          Language
        </p>
        <LanguageSwitcher />
      </div>
    </aside>
  );
}
