import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  const requiredRoutes = [
    "/",
    "/login",
    "/register",
    "/search",
    "/profile/test-id",
    "/membership",
    "/dashboard",
    "/settings",
  ];

  requiredRoutes.forEach((path) => {
    it(`matches a page for ${path} instead of falling back to not found`, () => {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });
  });
});
