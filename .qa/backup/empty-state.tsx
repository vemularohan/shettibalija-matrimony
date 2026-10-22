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
    <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-white px-6 py-12 text-center">
      <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-lg border border-[#E4DDD3] bg-[#F7F3EA] text-[#24103F]">
        {icon ?? <Sparkles className="h-5 w-5 text-[#087333]" />}
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#24103F] sm:text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button
          className="mt-5 min-h-[44px] rounded-md bg-[#24103F] px-5 text-sm font-semibold text-white touch-press hover:bg-[#351064]"
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
    <div className="rounded-xl border border-rose-200 bg-white px-6 py-10 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="font-serif text-base font-semibold text-rose-950 sm:text-lg">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description ?? "Please check your network connection and try again in a moment."}
      </p>
      {onRetry ? (
        <Button
          className="mt-4 min-h-[44px] rounded-md border border-rose-300 bg-white px-4 text-xs font-semibold text-rose-900 touch-press hover:bg-rose-50"
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
