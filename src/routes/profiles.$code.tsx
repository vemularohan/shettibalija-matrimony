import { createFileRoute } from "@tanstack/react-router";
import { ProfileDetailPage } from "./profile.$id";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/profiles/$code")({
  component: ProfileDetailPage,
  head: () => ({
    meta: [
      { title: `Member Profile | ${SITE_NAME}` },
      { name: "description", content: "View member matrimonial profile" },
    ],
  }),
});
