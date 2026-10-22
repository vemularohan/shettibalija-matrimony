import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "default";
  theme?: "dark" | "light";
  variant?: "pill" | "text";
}

export function LanguageSwitcher({
  className,
  size = "default",
  theme = "dark",
  variant = "pill",
}: LanguageSwitcherProps) {
  const { lang, setLanguage } = useLanguage();
  const isDark = theme === "dark";

  if (variant === "text") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          isDark ? "text-white/80" : "text-muted-foreground",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setLanguage("te")}
          className={cn(
            "transition-colors hover:text-[#F5E5B2]",
            lang === "te"
              ? isDark
                ? "font-bold text-[#F5E5B2]"
                : "font-bold text-[#24103F]"
              : "opacity-70",
          )}
        >
          తెలుగు
        </button>
        <span className="opacity-40">|</span>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "transition-colors hover:text-[#F5E5B2]",
            lang === "en"
              ? isDark
                ? "font-bold text-[#F5E5B2]"
                : "font-bold text-[#24103F]"
              : "opacity-70",
          )}
        >
          English
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center rounded-full p-0.5 shadow-sm transition-all",
        isDark
          ? "border border-[#D1A329]/30 bg-black/40 backdrop-blur-md"
          : "border border-[#E8E0D2] bg-white/90 backdrop-blur-md",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full transition-all duration-200 font-semibold tracking-wide",
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
          lang === "en"
            ? "bg-[#D1A329] text-[#24103F] font-bold shadow-xs scale-[1.02]"
            : isDark
              ? "text-white/80 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("te")}
        aria-pressed={lang === "te"}
        className={cn(
          "rounded-full transition-all duration-200 font-semibold tracking-wide",
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
          lang === "te"
            ? "bg-[#D1A329] text-[#24103F] font-bold shadow-xs scale-[1.02]"
            : isDark
              ? "text-white/80 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        తెలుగు
      </button>
    </div>
  );
}
