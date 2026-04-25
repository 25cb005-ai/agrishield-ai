import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Leaf, Shield, Sprout, Sun } from "lucide-react";
import { motion } from "motion/react";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

const features = [
  {
    icon: Shield,
    title: "Crop Disease Detection",
    desc: "AI-powered diagnosis from photos",
  },
  {
    icon: Sprout,
    title: "Seed Verification",
    desc: "Verify batch quality & certifications",
  },
  {
    icon: Sun,
    title: "Weather Insights",
    desc: "Hyperlocal farming advisories",
  },
];

export default function Login() {
  const { login, isLoggingIn } = useInternetIdentity();
  const { t } = useLanguage();

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="login.page"
    >
      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Hero card */}
          <Card className="border-border shadow-lg overflow-hidden">
            {/* Green header band */}
            <div className="bg-primary px-8 py-10 text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-8 w-40 h-40 rounded-full bg-black/10" />

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="relative z-10"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center">
                  <Leaf size={34} className="text-white" />
                </div>
                <h1 className="font-display text-3xl font-bold text-white mb-1">
                  {t("app.name")}
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  {t("app.tagline")}
                </p>
              </motion.div>
            </div>

            <CardContent className="px-8 py-8 space-y-6">
              {/* Feature highlights */}
              <div className="space-y-3">
                {features.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border" />

              {/* Sign in button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-smooth"
                  data-ocid="login.signin_button"
                >
                  {isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Connecting…
                    </span>
                  ) : (
                    t("auth.signinWith")
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Secured by the Internet Computer · No passwords needed
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
