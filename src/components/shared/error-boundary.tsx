import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    try {
      reportLovableError(error, {
        boundary: "react_error_boundary",
        componentStack: errorInfo.componentStack ?? undefined,
      });
    } catch {
      // Ignore reporting errors
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Something went wrong.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred while loading this section. Please try again.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button type="button" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
