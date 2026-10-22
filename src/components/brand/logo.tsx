import { Link } from "@tanstack/react-router";
import { SITE_LOGO_URL, SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { cn } from "@/lib/utils";

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<LogoSize, string> = {
  xs: "h-7 w-7",
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
  imgClassName?: string;
  withText?: boolean;
  linkToHome?: boolean;
  subtitle?: string;
  priority?: boolean;
  theme?: "light" | "dark";
}

/**
 * Shettibalija Sangham Official Logo Component.
 * Uses the exact project asset file `/logo.png` while strictly preserving
 * its natural 1281x1227 aspect ratio without distortion or cropping.
 */
export function ShettibalijaLogo({
  size = "md",
  className,
  imgClassName,
  withText = false,
  linkToHome = false,
  subtitle,
  priority = false,
  theme = "light",
}: LogoProps) {
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  const isDark = theme === "dark";

  const imageElement = (
    <div
      className={cn(
        "relative shrink-0 rounded-full flex items-center justify-center p-0.5 transition-all duration-300",
        // Handcrafted 3D Medallion presentation: subtle gold edge, warm ivory/gold bevel, soft physical depth
        isDark
          ? "bg-gradient-to-b from-white/10 to-black/20 border border-[#D1A329]/40 shadow-[0_1px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]"
          : "bg-gradient-to-b from-[#ffffff] to-[#FAF8F3] border border-[#D1A329]/35 shadow-[0_1px_3px_rgba(36,16,63,0.08),0_2px_6px_rgba(209,163,41,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
      )}
    >
      <img
        src={SITE_LOGO_URL}
        alt="Shettibalija Sangham Official Logo"
        width={1281}
        height={1227}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "aspect-[1281/1227] shrink-0 object-contain drop-shadow-xs transition-transform duration-200",
          sizeClass,
          imgClassName,
        )}
      />
    </div>
  );

  const content = withText ? (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      {imageElement}
      <div className="min-w-0 flex flex-col justify-center">
        <span
          className={cn(
            "block truncate font-serif text-base font-bold leading-tight sm:text-lg md:text-xl tracking-tight",
            isDark ? "text-white" : "text-[#24103F]",
          )}
        >
          {SITE_NAME}
        </span>
        <span
          className={cn(
            "block truncate text-[11px] font-semibold tracking-wide",
            isDark ? "text-[#F3D36A]" : "text-[#D1A329]",
          )}
        >
          {SITE_NAME_TE}
        </span>
        {subtitle ? (
          <span
            className={cn(
              "block truncate text-[10px]",
              isDark ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  ) : (
    <div className={cn("inline-flex items-center justify-center", className)}>{imageElement}</div>
  );

  if (linkToHome) {
    return (
      <Link
        to="/"
        className="inline-flex items-center transition-opacity hover:opacity-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        aria-label={`${SITE_NAME} Home`}
      >
        {content}
      </Link>
    );
  }

  return content;
}
