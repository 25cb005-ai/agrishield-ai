import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatPrice } from "../../types";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToOrders: () => void;
}

interface CheckoutForm {
  delivery_address: string;
  phone: string;
  notes: string;
}

export function CartDrawer({
  open,
  onOpenChange,
  onNavigateToOrders,
}: CartDrawerProps) {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    delivery_address: "",
    phone: "",
    notes: "",
  });
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  function handleFormChange(field: keyof CheckoutForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCheckout() {
    if (!form.delivery_address.trim() || !form.phone.trim()) return;
    if (!actor) return;

    setIsSubmitting(true);
    try {
      await actor.createOrder({
        total_amount: cartTotal,
        delivery_address: form.delivery_address,
        phone: form.phone,
        notes: form.notes,
        items: items.map((item) => ({
          pesticide_id: item.pesticide.id,
          name: item.pesticide.name,
          price: item.pesticide.price,
          quantity: BigInt(item.quantity),
          unit: item.pesticide.unit,
        })),
      });

      clearCart();
      setCheckoutOpen(false);
      onOpenChange(false);
      setForm({ delivery_address: "", phone: "", notes: "" });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!", {
        description: "Your order is being processed.",
        duration: 5000,
      });
      onNavigateToOrders();
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col p-0"
          data-ocid="shop.cart.sheet"
        >
          <SheetHeader className="px-6 py-4 border-b border-border bg-card">
            <SheetTitle className="flex items-center gap-2 text-foreground">
              <ShoppingCart size={18} className="text-primary" />
              {t("shop.cart")}
              {items.length > 0 && (
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div
              className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6"
              data-ocid="shop.cart.empty_state"
            >
              <Package size={48} className="text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">
                Your cart is empty
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                data-ocid="shop.cart.close_button"
              >
                {t("common.close")}
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.pesticide.id}
                      className="flex gap-3"
                      data-ocid={`shop.cart.item.${idx + 1}`}
                    >
                      {/* Product image or icon */}
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.pesticide.image_url ? (
                          <img
                            src={item.pesticide.image_url}
                            alt={item.pesticide.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        ) : (
                          <Package
                            size={20}
                            className="text-muted-foreground/50"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.pesticide.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.pesticide.brand}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-0.5">
                          {formatPrice(item.pesticide.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.pesticide.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                          data-ocid={`shop.cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-accent transition-colors"
                            onClick={() =>
                              updateQty(item.pesticide.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            data-ocid={`shop.cart.qty_minus.${idx + 1}`}
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm w-6 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-accent transition-colors"
                            onClick={() =>
                              updateQty(item.pesticide.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            data-ocid={`shop.cart.qty_plus.${idx + 1}`}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <SheetFooter className="px-6 py-4 border-t border-border bg-card flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-muted-foreground">
                    {t("shop.total")}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setCheckoutOpen(true)}
                  data-ocid="shop.cart.checkout_button"
                >
                  {t("shop.checkout")}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="shop.checkout.dialog">
          <DialogHeader>
            <DialogTitle>{t("shop.checkout")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="delivery_address" className="text-sm">
                {t("orders.address")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="delivery_address"
                placeholder="Enter your full delivery address"
                value={form.delivery_address}
                onChange={(e) =>
                  handleFormChange("delivery_address", e.target.value)
                }
                className="resize-none"
                rows={3}
                data-ocid="shop.checkout.address.textarea"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                data-ocid="shop.checkout.phone.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm">
                Notes{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions..."
                value={form.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                className="resize-none"
                rows={2}
                data-ocid="shop.checkout.notes.textarea"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("shop.total")}
              </span>
              <span className="font-bold text-foreground">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCheckoutOpen(false)}
              disabled={isSubmitting}
              data-ocid="shop.checkout.cancel_button"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={
                isSubmitting ||
                !form.delivery_address.trim() ||
                !form.phone.trim()
              }
              data-ocid="shop.checkout.confirm_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Placing…
                </>
              ) : (
                t("common.confirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
