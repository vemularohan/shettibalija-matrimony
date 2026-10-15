import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function useOwnMatrimonialProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["own-matrimonial-profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matrimonial_profiles")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useOwnPrivateDetails(profileId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["own-private-details", profileId],
    enabled: Boolean(user?.id && profileId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_private_details")
        .select("*")
        .eq("profile_id", profileId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useOwnPreferences(profileId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["own-preferences", profileId],
    enabled: Boolean(user?.id && profileId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_preferences")
        .select("*")
        .eq("profile_id", profileId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useOwnPhotos(profileId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["own-photos", profileId],
    enabled: Boolean(user?.id && profileId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_photos")
        .select("*")
        .eq("profile_id", profileId!)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useActiveMembership() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["active-membership", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select("*, membership_plans(*)")
        .eq("owner_id", user!.id)
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUnreadNotificationCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["unread-notifications", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user!.id)
        .is("read_at", null);
      if (error) throw error;
      return count ?? 0;
    },
  });
}
