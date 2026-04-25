import { Link, useLocation } from "@tanstack/react-router";
import { Camera, Cloud, Home, Package, ShoppingBag } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type { TranslationKey } from "../../context/LanguageContext";

const tabs: {
  to: string;
  icon: React.ElementType;
  labelKey: TranslationKey;
  ocidSlug: string;
}[] = [
  { to: "/", icon: Home, labelKey: "nav.dashboard", ocidSlug: "home" },
  {
    to: "/detect",
    icon: Camera,
    labelKey: "nav.detection",
    ocidSlug: "detect",
  },
  { to: "/shop", icon: ShoppingBag, labelKey: "nav.shop", ocidSlug: "shop" },
  { to: "/weather", icon: Cloud, labelKey: "nav.weather", ocidSlug: "weather" },
  { to: "/orders", icon: Package, labelKey: "nav.orders", ocidSlug: "orders" },
];

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-card"
      data-ocid="bottom-nav.panel"
      aria-label="Bottom navigation"
    >
      <ul className="flex items-stretch h-16">
        {tabs.map(({ to, icon: Icon, labelKey, ocidSlug }) => {
          const label = t(labelKey);
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                data-ocid={`bottom-nav.${ocidSlug}.tab`}
                className={[
                  "flex flex-col items-center justify-center h-full gap-1 text-xs font-medium transition-colors focus-visible:outline-none",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                aria-label={label}
              >
                <Icon size={22} />
                <span className="text-[10px] leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
