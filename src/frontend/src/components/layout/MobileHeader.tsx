import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "@tanstack/react-router";
import { Leaf, Menu } from "lucide-react";
import {
  Camera,
  Clock,
  Cloud,
  Home,
  Package,
  Settings,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import { useState } from "react";
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

export default function MobileHeader() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-card border-b shadow-sm"
      data-ocid="mobile-header.panel"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
          <Leaf size={18} className="text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-base text-foreground">
          AgriShield AI
        </span>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher compact />

        {/* Hamburger → full nav sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open navigation menu"
              data-ocid="mobile-header.menu_button"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-[260px]"
            style={{
              backgroundColor: "oklch(0.18 0.04 150)",
              color: "oklch(0.92 0.01 0)",
              border: "none",
            }}
          >
            <div
              className="flex items-center gap-3 px-5 py-5 border-b"
              style={{ borderColor: "oklch(0.24 0.05 150)" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary shadow-md">
                <Leaf size={20} className="text-primary-foreground" />
              </div>
              <div>
                <p
                  className="font-display font-bold text-base"
                  style={{ color: "oklch(0.92 0.01 0)" }}
                >
                  AgriShield AI
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.65 0.04 150)" }}
                >
                  Smart Crop Health
                </p>
              </div>
            </div>
            <nav className="py-3 px-2">
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
                        onClick={() => setOpen(false)}
                        data-ocid={`mobile-nav.${labelKey.split(".")[1]}.link`}
                        className={[
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-white/10",
                        ].join(" ")}
                        style={
                          isActive ? {} : { color: "oklch(0.75 0.03 150)" }
                        }
                      >
                        <Icon size={18} className="shrink-0" />
                        <span>{t(labelKey)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
