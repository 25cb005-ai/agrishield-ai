import { useLanguage } from "../../context/LanguageContext";
import type { Language } from "../../types";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "hi", label: "हि", flag: "🇮🇳" },
  { code: "ta", label: "த", flag: "🇮🇳" },
  { code: "te", label: "తె", flag: "🇮🇳" },
];

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({
  compact = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1" data-ocid="language.switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          data-ocid={`language.${lang.code}`}
          className={[
            "px-2 py-1 rounded text-xs font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            language === lang.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent",
          ].join(" ")}
          aria-label={`Switch to ${lang.label}`}
          aria-pressed={language === lang.code}
        >
          {compact ? lang.flag : lang.label}
        </button>
      ))}
    </div>
  );
}
