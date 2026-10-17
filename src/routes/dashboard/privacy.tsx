import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Shield, Lock, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/dashboard/privacy")({
  component: DashboardPrivacyPage,
});

function DashboardPrivacyPage() {
  const queryClient = useQueryClient();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;

  const [photoVisibility, setPhotoVisibility] = useState("members");
  const [profileVisibility, setProfileVisibility] = useState("visible");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setPhotoVisibility(profile.photo_visibility ?? "members");
      setProfileVisibility(profile.visibility ?? "visible");
    }
  }, [profile]);

  async function handleSave() {
    if (!profile?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("matrimonial_profiles")
        .update({
          photo_visibility: photoVisibility,
          visibility: profileVisibility,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast.success("Privacy settings updated successfully.");
      void queryClient.invalidateQueries({ queryKey: ["own-matrimonial-profile"] });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update privacy settings."));
    } finally {
      setSaving(false);
    }
  }

  if (ownProfileQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D9A514]/25 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#21083F]">
          Privacy &amp; Security Controls
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage how your matrimonial biodata, contact access, and photos are displayed to members.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="rounded-3xl border border-[#D9A514]/25 bg-white shadow-sm overflow-hidden">
          <CardHeader className="border-b border-[#D9A514]/15 bg-gradient-to-r from-[#21083F]/5 to-transparent pb-4">
            <div className="flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-[#D9A514]" />
              <CardTitle className="font-serif text-xl font-bold text-[#21083F]">
                Photo Visibility
              </CardTitle>
            </div>
            <CardDescription>Control who can view your uploaded photos.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <RadioGroup value={photoVisibility} onValueChange={setPhotoVisibility}>
              <div className="flex items-start space-x-3 rounded-2xl border border-border/60 p-4 hover:border-[#D9A514]/40 hover:bg-[#F8F7F4]/50 transition-all">
                <RadioGroupItem value="members" id="pv-members" className="mt-1" />
                <Label htmlFor="pv-members" className="cursor-pointer">
                  <p className="font-semibold text-[#21083F]">Visible to Logged-in Members</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Registered, verified community members can view your photos.
                  </p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 rounded-2xl border border-border/60 p-4 hover:border-[#D9A514]/40 hover:bg-[#F8F7F4]/50 transition-all">
                <RadioGroupItem value="hidden" id="pv-hidden" className="mt-1" />
                <Label htmlFor="pv-hidden" className="cursor-pointer">
                  <p className="font-semibold text-[#21083F]">Protected / Locked</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Photos stay blurred and locked until you accept their interest or authorize
                    access.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-[#D9A514]/25 bg-white shadow-sm overflow-hidden">
          <CardHeader className="border-b border-[#D9A514]/15 bg-gradient-to-r from-[#21083F]/5 to-transparent pb-4">
            <div className="flex items-center gap-2.5">
              <Eye className="h-5 w-5 text-[#D9A514]" />
              <CardTitle className="font-serif text-xl font-bold text-[#21083F]">
                Search Visibility
              </CardTitle>
            </div>
            <CardDescription>Control your profile appearance in public discovery.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility}>
              <div className="flex items-start space-x-3 rounded-2xl border border-border/60 p-4 hover:border-[#D9A514]/40 hover:bg-[#F8F7F4]/50 transition-all">
                <RadioGroupItem value="visible" id="sv-visible" className="mt-1" />
                <Label htmlFor="sv-visible" className="cursor-pointer">
                  <p className="font-semibold text-[#21083F]">Visible in Search</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your approved profile will be listed in searches and recommendation feeds.
                  </p>
                </Label>
              </div>

              <div className="flex items-start space-x-3 rounded-2xl border border-border/60 p-4 hover:border-[#D9A514]/40 hover:bg-[#F8F7F4]/50 transition-all">
                <RadioGroupItem value="hidden" id="sv-hidden" className="mt-1" />
                <Label htmlFor="sv-hidden" className="cursor-pointer">
                  <p className="font-semibold text-[#21083F]">Temporarily Hidden</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pause inquiries. Your profile will not appear in search results.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#087A32] to-[#0A963E] hover:from-[#034B21] hover:to-[#087A32] text-white font-bold px-7 shadow-md border border-[#D9A514]/30"
          >
            {saving ? "Saving..." : "Save Privacy Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
