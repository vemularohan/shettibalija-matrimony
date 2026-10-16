import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "default";
  theme?: "dark" | "light";
}

export function LanguageSwitcher({
  className,
  size = "default",
  theme = "light",
}: LanguageSwitcherProps) {
  const { lang, setLanguage } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center rounded-full p-0.5 shadow-xs transition-all",
        isDark
          ? "border border-white/20 bg-black/30 backdrop-blur-md"
          : "border border-border/80 bg-background/80 backdrop-blur-xs",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full transition-all duration-150 font-medium",
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
          lang === "en"
            ? isDark
              ? "bg-[#D9A514] text-[#21083F] font-bold shadow-xs"
              : "bg-[#32105F] text-white shadow-xs font-semibold"
            : isDark
              ? "text-white/85 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("te")}
        aria-pressed={lang === "te"}
        className={cn(
          "rounded-full transition-all duration-150 font-medium",
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
          lang === "te"
            ? isDark
              ? "bg-[#D9A514] text-[#21083F] font-bold shadow-xs"
              : "bg-[#32105F] text-white shadow-xs font-semibold"
            : isDark
              ? "text-white/85 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        తెలుగు
      </button>
    </div>
  );
}
