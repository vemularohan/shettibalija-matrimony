import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/errors";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";

export function useProfileActions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ownProfile = useOwnMatrimonialProfile();

  const shortlistQuery = useQuery({
    queryKey: ["shortlist-ids", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("shortlisted_profiles").select("profile_id");
      if (error) throw error;
      return new Set((data ?? []).map((row) => row.profile_id));
    },
  });

  const interestsQuery = useQuery({
    queryKey: ["sent-interest-ids", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interests")
        .select("to_profile_id, status")
        .eq("from_user_id", user!.id);
      if (error) throw error;
      return new Map((data ?? []).map((row) => [row.to_profile_id, row.status]));
    },
  });

  const requireUser = () => {
    if (!user) {
      toast.error("Please login to continue.");
      return false;
    }
    return true;
  };

  const toggleShortlist = useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Please login to shortlist profiles.");
      if (ownProfile.data?.id === profileId)
        throw new Error("You cannot shortlist your own profile.");
      const already = shortlistQuery.data?.has(profileId);
      if (already) {
        const { error } = await supabase
          .from("shortlisted_profiles")
          .delete()
          .eq("owner_id", user.id)
          .eq("profile_id", profileId);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase.from("shortlisted_profiles").insert({
        owner_id: user.id,
        profile_id: profileId,
      });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: (result) => {
      toast.success(result === "added" ? "Added to shortlist" : "Removed from shortlist");
      void queryClient.invalidateQueries({ queryKey: ["shortlist-ids"] });
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
      void queryClient.invalidateQueries({ queryKey: ["shortlist-profiles"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update shortlist.")),
  });

  const sendInterest = useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Please login to express interest.");
      if (ownProfile.data?.id === profileId)
        throw new Error("You cannot send interest to your own profile.");
      const { error } = await supabase.from("interests").insert({
        from_user_id: user.id,
        to_profile_id: profileId,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Interest sent. We'll let you know if it is accepted.");
      void queryClient.invalidateQueries({ queryKey: ["sent-interest-ids"] });
      void queryClient.invalidateQueries({ queryKey: ["interests"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not send interest.")),
  });

  const sendContactRequest = useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Please login to request contact.");
      const { error } = await supabase.from("contact_requests").insert({
        from_user_id: user.id,
        to_profile_id: profileId,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contact request sent");
      void queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not send contact request.")),
  });

  const reportProfile = useMutation({
    mutationFn: async ({ profileId, reason }: { profileId: string; reason: string }) => {
      if (!user) throw new Error("Please login to report a profile.");
      const { error } = await supabase.from("profile_reports").insert({
        reporter_id: user.id,
        profile_id: profileId,
        reason,
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Report submitted. Our team will review it."),
    onError: (error) => toast.error(getErrorMessage(error, "Could not submit report.")),
  });

  return {
    user,
    requireUser,
    shortlistedIds: shortlistQuery.data ?? new Set<string>(),
    sentInterests: interestsQuery.data ?? new Map<string, string>(),
    toggleShortlist,
    sendInterest,
    sendContactRequest,
    reportProfile,
  };
}
