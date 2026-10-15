import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PHOTO_BUCKET } from "@/lib/site";
import type { Database } from "@/integrations/supabase/types";

const inputSchema = z.object({
  profileId: z.string(),
});

export const getAuthorizedPhotos = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { createClient } = await import("@supabase/supabase-js");

    const SUPABASE_URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const PUBLISHABLE =
      process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (!SUPABASE_URL || !PUBLISHABLE) {
      return {
        allowed: false as const,
        reason: "server_misconfigured",
        hasPhotos: false,
        photos: [] as const,
      };
    }

    if (!data.profileId) {
      return {
        allowed: false as const,
        reason: "invalid_id",
        hasPhotos: false,
        photos: [] as const,
      };
    }

    const request = getRequest();
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const userClient = createClient<Database>(
      SUPABASE_URL,
      PUBLISHABLE,
      token
        ? {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          }
        : {
            auth: { persistSession: false, autoRefreshToken: false },
          },
    );

    const { data: canOpen } = await userClient.rpc("viewer_can_open_photos", {
      p_profile_id: data.profileId,
    });

    const { data: statusRows } = await userClient.rpc("profile_photo_status", {
      p_profile_id: data.profileId,
    });
    const status = statusRows?.[0];

    if (!canOpen) {
      return {
        allowed: false as const,
        reason: "locked" as const,
        hasPhotos: Boolean(status?.has_photos),
        photoVisibility: status?.photo_visibility ?? "hidden",
        photos: [] as const,
      };
    }

    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    const adminClient = serviceKey
      ? createClient<Database>(SUPABASE_URL, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : userClient;

    const { data: rows, error } = await adminClient
      .from("profile_photos")
      .select("id, storage_path, is_primary, created_at")
      .eq("profile_id", data.profileId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (error || !rows?.length) {
      return {
        allowed: true as const,
        hasPhotos: false,
        photoVisibility: status?.photo_visibility ?? "members",
        photos: [] as const,
      };
    }

    const signed = await Promise.all(
      rows.map(async (row) => {
        const { data: signedData } = await adminClient.storage
          .from(PHOTO_BUCKET)
          .createSignedUrl(row.storage_path, 60);
        return {
          id: row.id,
          isPrimary: row.is_primary,
          url: signedData?.signedUrl ?? null,
        };
      }),
    );

    return {
      allowed: true as const,
      hasPhotos: true,
      photoVisibility: status?.photo_visibility ?? "members",
      photos: signed.filter((item): item is { id: string; isPrimary: boolean; url: string } =>
        Boolean(item.url),
      ),
    };
  });
