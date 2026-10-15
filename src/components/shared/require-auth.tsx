import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAuth({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { user, loading, isAdmin, isModerator } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Please login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is available to registered members only.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (admin && !isAdmin && !isModerator) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have staff permission.
        </p>
        <Button asChild className="mt-6">
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  return children;
}
