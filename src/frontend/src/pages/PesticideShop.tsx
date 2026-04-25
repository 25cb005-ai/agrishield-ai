import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CartDrawer } from "../components/shop/CartDrawer";
import { ProductCard } from "../components/shop/ProductCard";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useListPesticides } from "../hooks/useQueries";
import type { Pesticide } from "../types";
import { PesticideCategory, getPesticideCategoryLabel } from "../types";

type SortOption = "none" | "price_asc" | "price_desc";
type AvailabilityFilter = "all" | "in_stock";

const CATEGORIES: Array<{ label: string; value: PesticideCategory | "all" }> = [
  { label: "All", value: "all" },
  {
    label: getPesticideCategoryLabel(PesticideCategory.insecticide),
    value: PesticideCategory.insecticide,
  },
  {
    label: getPesticideCategoryLabel(PesticideCategory.fungicide),
    value: PesticideCategory.fungicide,
  },
  {
    label: getPesticideCategoryLabel(PesticideCategory.herbicide),
    value: PesticideCategory.herbicide,
  },
  {
    label: getPesticideCategoryLabel(PesticideCategory.biopesticide),
    value: PesticideCategory.biopesticide,
  },
  {
    label: getPesticideCategoryLabel(PesticideCategory.rodenticide),
    value: PesticideCategory.rodenticide,
  },
  {
    label: getPesticideCategoryLabel(PesticideCategory.other),
    value: PesticideCategory.other,
  },
];

export default function PesticideShop() {
  const { t } = useLanguage();
  const { data: pesticides, isLoading, isError, refetch } = useListPesticides();
  const { addToCart, cartCount } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    PesticideCategory | "all"
  >("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo<Pesticide[]>(() => {
    let list = pesticides ?? [];

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    // Availability filter
    if (availabilityFilter === "in_stock") {
      list = list.filter((p) => p.is_available && p.stock > 0n);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortOption === "price_asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [pesticides, categoryFilter, availabilityFilter, search, sortOption]);

  const hasActiveFilters =
    categoryFilter !== "all" ||
    availabilityFilter !== "all" ||
    search.trim() !== "" ||
    sortOption !== "none";

  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setAvailabilityFilter("all");
    setSortOption("none");
  }

  return (
    <div className="flex flex-col min-h-full" data-ocid="pesticide-shop.page">
      {/* Page header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold text-foreground truncate">
              {t("shop.title")}
            </h1>
          </div>

          {/* Cart icon button */}
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-accent transition-colors"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            data-ocid="shop.cart.open_modal_button"
          >
            <ShoppingCart size={20} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 sm:px-6 pb-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={`${t("common.search")} by name or brand…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 bg-background"
              data-ocid="shop.search_input"
            />
            {search && (
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                categoryFilter === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-accent"
              }`}
              data-ocid={`shop.category.tab.${cat.value}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div className="px-4 sm:px-6 pb-3 flex items-center gap-2 flex-wrap">
          <SlidersHorizontal
            size={14}
            className="text-muted-foreground flex-shrink-0"
          />

          {/* Availability toggle */}
          <button
            type="button"
            onClick={() =>
              setAvailabilityFilter((prev) =>
                prev === "all" ? "in_stock" : "all",
              )
            }
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              availabilityFilter === "in_stock"
                ? "bg-primary/10 text-primary border-primary/40"
                : "bg-background text-muted-foreground border-border hover:bg-accent"
            }`}
            data-ocid="shop.availability.toggle"
          >
            {t("shop.inStock")} only
          </button>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-background text-foreground hover:bg-accent transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
            data-ocid="shop.sort.select"
          >
            <option value="none">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              data-ocid="shop.clear_filters.button"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 sm:px-6 py-4">
        {/* Loading */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="shop.products.loading_state"
          >
            {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
              <div key={key} className="space-y-2">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="flex flex-col items-center gap-3 py-16 text-center"
            data-ocid="shop.products.error_state"
          >
            <AlertCircle size={40} className="text-destructive/50" />
            <p className="text-muted-foreground">{t("common.error")}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-ocid="shop.retry_button"
            >
              {t("common.retry")}
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div
            className="flex flex-col items-center gap-3 py-16 text-center"
            data-ocid="shop.products.empty_state"
          >
            <ShoppingCart size={40} className="text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              {t("common.noResults")}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                data-ocid="shop.clear_filters_cta.button"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Product count */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {pesticides && filtered.length !== pesticides.length && (
                <span> of {pesticides.length}</span>
              )}
            </p>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Filtered
              </Badge>
            )}
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="shop.products.list"
          >
            {filtered.map((pesticide, idx) => (
              <ProductCard
                key={pesticide.id}
                pesticide={pesticide}
                onAddToCart={addToCart}
                index={idx + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        onNavigateToOrders={() => navigate({ to: "/orders" })}
      />
    </div>
  );
}
