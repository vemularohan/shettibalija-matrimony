import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useOwnMatrimonialProfile,
  useOwnPrivateDetails,
  useOwnPreferences,
} from "@/hooks/use-member-data";
import { DetailedProfileForm } from "@/components/profile/detailed-profile-form";
import {
  reconstructDetailedFormData,
  saveDetailedMatrimonialProfile,
} from "@/lib/detailed-profile-api";
import type { DetailedProfileFormData } from "@/lib/detailed-profile-types";
import { getErrorMessage } from "@/lib/errors";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { SITE_NAME_TE } from "@/lib/site";

export const Route = createFileRoute("/dashboard/profile")({
  component: DashboardProfilePage,
});

function DashboardProfilePage() {
  const { user, account } = useAuth();
  const queryClient = useQueryClient();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const privateDetailsQuery = useOwnPrivateDetails(profile?.id);
  const privateDetails = privateDetailsQuery.data;
  const preferencesQuery = useOwnPreferences(profile?.id);
  const preferences = preferencesQuery.data;

  const [saving, setSaving] = useState(false);

  const initialFormData = useMemo(() => {
    return reconstructDetailedFormData({
      profile: (profile ?? null) as Record<string, unknown> | null,
      privateDetails: (privateDetails ?? null) as Record<string, unknown> | null,
      partnerPreferences: (preferences ?? null) as Record<string, unknown> | null,
      accountPhone: account?.phone ?? null,
    });
  }, [profile, privateDetails, preferences, account?.phone]);

  async function handleSave(data: DetailedProfileFormData) {
    if (!user) return;
    setSaving(true);

    try {
      await saveDetailedMatrimonialProfile({
        userId: user.id,
        profileId: profile?.id,
        formData: data,
      });

      toast.success("Matrimonial profile details saved successfully!");
      void queryClient.invalidateQueries({ queryKey: ["own-matrimonial-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["own-private-details"] });
      void queryClient.invalidateQueries({ queryKey: ["own-preferences"] });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save profile."));
    } finally {
      setSaving(false);
    }
  }

  if (ownProfileQuery.isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-[#E8E2D8] bg-white p-5 shadow-xs">
        <ShettibalijaLogo size="lg" priority />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D9A514]">
            {SITE_NAME_TE}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#32105F]">
            Matrimonial Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Maintain your complete 10-section matrimonial biodata for verified matchmaking in Telugu
            and English.
          </p>
        </div>
      </div>

      <DetailedProfileForm
        userId={user?.id}
        initialData={initialFormData}
        onSave={handleSave}
        isSubmitting={saving}
        submitButtonText="Save All Profile Details"
      />
    </div>
  );
}
