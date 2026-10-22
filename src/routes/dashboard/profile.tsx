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
import { MemberPageHeader } from "@/components/dashboard/member-page-header";

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
    <div className="space-y-7 pb-12">
      <MemberPageHeader
        kicker="Your profile"
        title="Edit your profile"
        description="Keep the details families rely on up to date. You can work through the sections in order, or return to any section later."
      />

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
