import type { ReactNode } from "react";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[#D1A329]/35 bg-gradient-to-b from-[#FAF9F6] to-white px-6 py-12 text-center shadow-xs">
      <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#24103F]/5 text-[#24103F] border border-[#D1A329]/20 shadow-xs">
        {icon ?? <Sparkles className="h-6 w-6 text-[#D1A329]" />}
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#24103F]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button
          className="mt-5 min-h-[44px] rounded-xl bg-[#24103F] hover:bg-[#351064] text-white px-5 text-sm font-semibold touch-press shadow-sm"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
      {children}
    </div>
  );
}

export function ErrorState({
  title = "Could not load this page",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-gradient-to-b from-rose-50/60 to-white px-6 py-10 text-center shadow-xs">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100/70 text-rose-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="font-serif text-base sm:text-lg font-bold text-rose-950">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description ?? "Please check your network connection and try again in a moment."}
      </p>
      {onRetry ? (
        <Button
          className="mt-4 min-h-[44px] rounded-xl border border-rose-300 text-rose-900 bg-white hover:bg-rose-50/80 px-4 text-xs font-semibold touch-press inline-flex items-center gap-1.5"
          variant="outline"
          onClick={onRetry}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
