import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Leaf, Plus } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type { Pesticide } from "../../types";
import {
  PesticideCategory,
  formatPrice,
  getPesticideCategoryLabel,
} from "../../types";

interface ProductCardProps {
  pesticide: Pesticide;
  onAddToCart: (pesticide: Pesticide) => void;
  index: number;
}

const CATEGORY_COLORS: Record<PesticideCategory, string> = {
  [PesticideCategory.insecticide]:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  [PesticideCategory.fungicide]:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  [PesticideCategory.herbicide]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  [PesticideCategory.rodenticide]:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  [PesticideCategory.biopesticide]:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  [PesticideCategory.other]: "bg-secondary text-secondary-foreground",
};

export function ProductCard({
  pesticide,
  onAddToCart,
  index,
}: ProductCardProps) {
  const { t } = useLanguage();
  const isAvailable = pesticide.is_available && pesticide.stock > 0n;
  const categoryColor =
    CATEGORY_COLORS[pesticide.category] ??
    "bg-secondary text-secondary-foreground";

  return (
    <Card
      className="flex flex-col overflow-hidden border-border hover:shadow-md transition-shadow duration-200"
      data-ocid={`shop.product.item.${index}`}
    >
      {/* Product image or placeholder */}
      <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden">
        {pesticide.image_url ? (
          <img
            src={pesticide.image_url}
            alt={pesticide.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (
                e.currentTarget.nextElementSibling as HTMLElement | null
              )?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`flex flex-col items-center gap-1 text-muted-foreground ${pesticide.image_url ? "hidden" : ""}`}
        >
          <Leaf size={36} className="opacity-30" />
        </div>

        {/* Category badge overlay */}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}
        >
          {getPesticideCategoryLabel(pesticide.category)}
        </span>

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-destructive bg-background px-2 py-1 rounded-full border border-destructive/30">
              {t("shop.outOfStock")}
            </span>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4 space-y-2">
        <div>
          <h3
            className="font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem]"
            title={pesticide.name}
          >
            {pesticide.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {pesticide.brand}
          </p>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {pesticide.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-primary">
            {formatPrice(pesticide.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            /{pesticide.unit}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
            {t("shop.inStock")}: {Number(pesticide.stock)}
          </Badge>
          {pesticide.active_ingredient && (
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0 h-5 max-w-[140px] truncate"
            >
              {pesticide.active_ingredient}
            </Badge>
          )}
        </div>

        {pesticide.suitable_for.length > 0 && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Suitable for: </span>
            {pesticide.suitable_for.join(", ")}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          disabled={!isAvailable}
          onClick={() => onAddToCart(pesticide)}
          data-ocid={`shop.add_to_cart.${index}`}
        >
          <Plus size={14} className="mr-1.5" />
          {isAvailable ? t("shop.addToCart") : t("shop.outOfStock")}
        </Button>
      </CardFooter>
    </Card>
  );
}
