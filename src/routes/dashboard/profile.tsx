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
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl border border-[#D9A514]/25 bg-white p-6 shadow-sm">
        <div className="relative shrink-0 rounded-2xl bg-[#21083F]/5 p-2 border border-[#D9A514]/20">
          <ShettibalijaLogo size="lg" priority />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A514]">
            {SITE_NAME_TE} • VERIFIED MATRIMONIAL BIODATA
          </span>
          <h1 className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#21083F]">
            Matrimonial Profile Editor
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Complete your official 10-section biodata for authentic Shettibalija community alliances
            with bilingual English &amp; Telugu support.
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
