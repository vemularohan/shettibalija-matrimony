import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useOwnMatrimonialProfile, useOwnPrivateDetails } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import {
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  STATES,
  MARITAL_STATUS_OPTIONS,
} from "@/lib/options";

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

  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("bride");
  const [age, setAge] = useState("25");
  const [heightCm, setHeightCm] = useState("165");
  const [state, setState] = useState("Andhra Pradesh");
  const [city, setCity] = useState("");
  const [nativePlace, setNativePlace] = useState("");
  const [education, setEducation] = useState("B.Tech");
  const [occupation, setOccupation] = useState("Software Professional");
  const [maritalStatus, setMaritalStatus] = useState("never_married");
  const [familySummary, setFamilySummary] = useState("");

  // Private contact details
  const [parentContact, setParentContact] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setGender(profile.gender ?? "bride");
      setAge(String(profile.age ?? 25));
      setHeightCm(profile.height_cm ? String(profile.height_cm) : "165");
      setState(profile.state ?? "Andhra Pradesh");
      setCity(profile.city ?? "");
      setNativePlace(profile.native_place ?? "");
      setEducation(profile.education ?? "B.Tech");
      setOccupation(profile.occupation ?? "Software Professional");
      setMaritalStatus(profile.marital_status ?? "never_married");
      setFamilySummary(profile.family_summary ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (account?.phone) {
      setParentContact(account.phone);
    }
  }, [account]);

  useEffect(() => {
    if (privateDetails) {
      setFatherOccupation(privateDetails.father_occupation ?? "");
      setMotherOccupation(privateDetails.mother_occupation ?? "");
    }
  }, [privateDetails]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const parsedAge = Number(age) || 25;
      const parsedHeight = Number(heightCm) || null;

      // Update phone on user profile
      if (parentContact.trim()) {
        await supabase.from("profiles").update({ phone: parentContact.trim() }).eq("id", user.id);
      }

      if (profile?.id) {
        // Update existing profile
        const { error } = await supabase
          .from("matrimonial_profiles")
          .update({
            display_name: displayName.trim(),
            gender,
            age: parsedAge,
            height_cm: parsedHeight,
            state: state || null,
            city: city.trim() || null,
            native_place: nativePlace.trim() || null,
            education: education || null,
            occupation: occupation || null,
            marital_status: maritalStatus,
            family_summary: familySummary.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) throw error;

        // Upsert private details
        await supabase.from("profile_private_details").upsert({
          owner_id: user.id,
          profile_id: profile.id,
          father_occupation: fatherOccupation.trim() || null,
          mother_occupation: motherOccupation.trim() || null,
        });
      } else {
        // Insert new profile
        const { data: newProfile, error } = await supabase
          .from("matrimonial_profiles")
          .insert({
            owner_id: user.id,
            display_name: displayName.trim() || "Member",
            gender,
            age: parsedAge,
            height_cm: parsedHeight,
            state: state || null,
            city: city.trim() || null,
            native_place: nativePlace.trim() || null,
            education: education || null,
            occupation: occupation || null,
            marital_status: maritalStatus,
            community: "Shettibalija",
            mother_tongue: "Telugu",
            family_summary: familySummary.trim() || null,
            visibility: "visible",
            photo_visibility: "members",
          })
          .select("id")
          .single();

        if (error) throw error;

        if (newProfile) {
          await supabase.from("profile_private_details").upsert({
            owner_id: user.id,
            profile_id: newProfile.id,
            father_occupation: fatherOccupation.trim() || null,
            mother_occupation: motherOccupation.trim() || null,
          });
        }
      }

      toast.success("Profile saved successfully!");
      void queryClient.invalidateQueries({ queryKey: ["own-matrimonial-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["own-private-details"] });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save profile."));
    } finally {
      setSaving(false);
    }
  }

  if (ownProfileQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Edit My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your matrimonial details accurate and up to date for better family matches.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Basic Information</CardTitle>
            <CardDescription>Public information visible in matrimonial search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name">Display Name *</Label>
                <Input
                  id="prof-name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-gender">Gender *</Label>
                <select
                  id="prof-gender"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={saving}
                >
                  <option value="bride">Bride (Female)</option>
                  <option value="groom">Groom (Male)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-age">Age (Years) *</Label>
                <Input
                  id="prof-age"
                  type="number"
                  min={18}
                  max={75}
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-height">Height (cm)</Label>
                <Input
                  id="prof-height"
                  type="number"
                  min={120}
                  max={220}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-marital">Marital Status</Label>
                <select
                  id="prof-marital"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  disabled={saving}
                >
                  {MARITAL_STATUS_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-state">State</Label>
                <select
                  id="prof-state"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={saving}
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-city">City / Town</Label>
                <Input
                  id="prof-city"
                  placeholder="e.g. Hyderabad, Kakinada"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-native">Native Place</Label>
                <Input
                  id="prof-native"
                  placeholder="e.g. East Godavari"
                  value={nativePlace}
                  onChange={(e) => setNativePlace(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="prof-edu">Education</Label>
                <select
                  id="prof-edu"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  disabled={saving}
                >
                  {EDUCATION_OPTIONS.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-occ">Occupation</Label>
                <select
                  id="prof-occ"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  disabled={saving}
                >
                  {OCCUPATION_OPTIONS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-family">About Family & Background</Label>
              <Textarea
                id="prof-family"
                rows={3}
                placeholder="Share about your parents, siblings, family values, and native background..."
                value={familySummary}
                onChange={(e) => setFamilySummary(e.target.value)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Private Family Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Private Family & Contact Details</CardTitle>
            <CardDescription>
              These details are kept confidential and only shared with authorized matching requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-pcontact">Parent / Guardian Phone</Label>
                <Input
                  id="prof-pcontact"
                  placeholder="e.g. 9876543210"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-focc">Father's Occupation</Label>
                <Input
                  id="prof-focc"
                  placeholder="e.g. Business, Retired Officer"
                  value={fatherOccupation}
                  onChange={(e) => setFatherOccupation(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-mocc">Mother's Occupation</Label>
                <Input
                  id="prof-mocc"
                  placeholder="e.g. Homemaker, Teacher"
                  value={motherOccupation}
                  onChange={(e) => setMotherOccupation(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}
