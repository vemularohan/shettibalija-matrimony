import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-12 text-center">
      <h3 className="font-serif text-xl text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
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
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {description ?? "Please try again in a moment."}
      </p>
      {onRetry ? (
        <Button className="mt-4" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
