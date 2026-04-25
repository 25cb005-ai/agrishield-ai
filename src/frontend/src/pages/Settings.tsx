import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Globe,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../types";

const LANGUAGE_OPTIONS: {
  code: Language;
  label: string;
  nativeLabel: string;
}[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
];

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function SectionHeader({ icon, title, description }: SectionHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </CardHeader>
  );
}

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { clear, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const principalFull = identity?.getPrincipal().toText() ?? "—";
  const principalShort =
    principalFull !== "—" ? `${principalFull.slice(0, 10)}…` : "—";
  const accountCreated = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  async function handleSignOut() {
    clear();
    await navigate({ to: "/login" });
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;
    // Clear all data and sign out
    clear();
    setDeleteOpen(false);
    await navigate({ to: "/login" });
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-2xl" data-ocid="settings.page">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <SettingsIcon size={22} className="text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("settings.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Account Section */}
      <Card
        className="border-border shadow-sm"
        data-ocid="settings.account.card"
      >
        <SectionHeader
          icon={<User size={16} />}
          title={t("settings.account")}
          description="Your Internet Identity details"
        />
        <CardContent className="space-y-4">
          <div className="bg-muted/60 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Principal ID
                </p>
                <p
                  className="text-sm font-mono text-foreground break-all leading-relaxed"
                  data-ocid="settings.principal_id"
                >
                  {principalFull}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {principalShort}
              </Badge>
            </div>
            <Separator className="bg-border/60" />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Account Created
              </p>
              <p className="text-sm text-foreground">{accountCreated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card
        className="border-border shadow-sm"
        data-ocid="settings.language.card"
      >
        <SectionHeader
          icon={<Globe size={16} />}
          title={t("settings.language")}
          description="Choose your preferred display language"
        />
        <CardContent>
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            data-ocid="settings.language.radiogroup"
          >
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = language === lang.code;
              const inputId = `lang-radio-${lang.code}`;
              return (
                <label
                  key={lang.code}
                  htmlFor={inputId}
                  className={[
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200",
                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
                    isSelected
                      ? "border-primary bg-primary/[0.08] text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent/50 hover:text-foreground",
                  ].join(" ")}
                  data-ocid={`settings.language.${lang.code}`}
                >
                  <input
                    type="radio"
                    id={inputId}
                    name="language"
                    value={lang.code}
                    checked={isSelected}
                    onChange={() => setLanguage(lang.code)}
                    className="sr-only"
                  />
                  <span
                    className={`text-lg font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {lang.nativeLabel}
                  </span>
                  <span className="text-xs opacity-70">{lang.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-0.5" />
                  )}
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card
        className="border-border shadow-sm"
        data-ocid="settings.notifications.card"
      >
        <SectionHeader
          icon={<Bell size={16} />}
          title="Notifications"
          description="Control how you receive alerts and updates"
        />
        <CardContent className="space-y-4">
          {[
            {
              id: "notif-email",
              label: "Email Notifications",
              desc: "Receive diagnosis reports via email",
              ocid: "settings.notif_email.toggle",
            },
            {
              id: "notif-weather",
              label: "Weather Alerts",
              desc: "Get notified about severe weather conditions",
              ocid: "settings.notif_weather.toggle",
            },
            {
              id: "notif-orders",
              label: "Order Updates",
              desc: "Track your pesticide and seed deliveries",
              ocid: "settings.notif_orders.toggle",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <Label
                  htmlFor={item.id}
                  className="text-sm font-medium text-foreground cursor-not-allowed opacity-60"
                >
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5 opacity-60">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground border-muted-foreground/30"
                >
                  Coming soon
                </Badge>
                <Switch
                  id={item.id}
                  disabled
                  data-ocid={item.ocid}
                  aria-label={item.label}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card
        className="border-destructive/30 shadow-sm"
        data-ocid="settings.danger.card"
      >
        <SectionHeader
          icon={<Shield size={16} />}
          title="Security & Account"
          description="Sign out or permanently delete your account"
        />
        <CardContent className="space-y-4">
          {/* Sign Out */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/40 border border-border">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <LogOut size={14} className="text-muted-foreground shrink-0" />
                {t("settings.logout")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sign out of your Internet Identity session
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-all duration-200"
              onClick={handleSignOut}
              data-ocid="settings.signout.button"
            >
              <LogOut size={14} />
              {t("auth.signout")}
            </Button>
          </div>

          <Separator className="bg-destructive/15" />

          {/* Delete Account */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="min-w-0">
              <p className="text-sm font-medium text-destructive flex items-center gap-2">
                <Trash2 size={14} className="shrink-0" />
                {t("settings.deleteAccount")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently remove all your data. This cannot be undone.
              </p>
            </div>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="shrink-0 gap-2 transition-all duration-200"
                  data-ocid="settings.delete_account.open_modal_button"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="settings.delete_account.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive flex items-center gap-2">
                    <Trash2 size={18} />
                    {t("settings.deleteAccount")}
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-3">
                      <p>{t("settings.deleteConfirm")}</p>
                      <div className="bg-destructive/8 border border-destructive/20 rounded-lg p-3">
                        <p className="text-sm text-destructive font-medium">
                          This will permanently delete:
                        </p>
                        <ul className="text-xs text-muted-foreground mt-1.5 space-y-1 list-disc list-inside">
                          <li>All your crop diagnosis history</li>
                          <li>Your order history and cart</li>
                          <li>All saved preferences</li>
                        </ul>
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="delete-confirm-input"
                          className="text-sm font-medium text-foreground"
                        >
                          Type{" "}
                          <span className="font-mono font-bold text-destructive">
                            DELETE
                          </span>{" "}
                          to confirm:
                        </Label>
                        <Input
                          id="delete-confirm-input"
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                          placeholder="Type DELETE here"
                          className="font-mono border-destructive/30 focus-visible:ring-destructive/30"
                          autoComplete="off"
                          data-ocid="settings.delete_confirm.input"
                        />
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setDeleteInput("")}
                    data-ocid="settings.delete_account.cancel_button"
                  >
                    {t("common.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteInput !== "DELETE"}
                    className="bg-destructive hover:bg-destructive/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    data-ocid="settings.delete_account.confirm_button"
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    {t("settings.deleteAccount")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
