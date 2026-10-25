import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { KeyRound, User, LogOut, Globe, PauseCircle, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { MemberPageHeader } from "@/components/dashboard/member-page-header";
import { useLanguage } from "@/lib/i18n";
import { useOwnMatrimonialProfile } from "@/hooks/use-member-data";

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettingsPage,
});

export function DashboardSettingsPage() {
  const { user, account, refreshAccount, signOut } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(account?.full_name ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [savingAccount, setSavingAccount] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isTe = lang === "te";

  async function handleAccountUpdate(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingAccount(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      await refreshAccount();
      toast.success(isTe ? "ఖాతా వివరాలు నవీకరించబడ్డాయి." : "Account profile updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update account."));
    } finally {
      setSavingAccount(false);
    }
  }

  async function handlePasswordUpdate(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(
        isTe ? "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి." : "Password must be at least 6 characters.",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error(isTe ? "పాస్‌వర్డ్‌లు సరిపోలడం లేదు." : "Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(isTe ? "పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది." : "Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update password."));
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeactivate() {
    if (!user) return;
    setDeactivating(true);
    try {
      // Hide profile from discovery and suspend visibility
      if (profile?.id) {
        await supabase
          .from("matrimonial_profiles")
          .update({
            visibility: "hidden",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);
      }
      toast.success(
        isTe
          ? "మీ ప్రొఫైల్ తాత్కాలికంగా దాచబడింది. తిరిగి లాగిన్ అయినప్పుడు మీరు దీన్ని మళ్లీ యాక్టివేట్ చేసుకోవచ్చు."
          : "Your matrimonial profile has been paused and hidden from member search.",
      );
      await ownProfileQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not pause profile."));
    } finally {
      setDeactivating(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try {
      if (profile?.id) {
        await supabase.from("matrimonial_profiles").delete().eq("id", profile.id);
      }
      toast.success(isTe ? "మీ ప్రొఫైల్ తొలగించబడింది." : "Your profile has been deleted.");
      await signOut();
      void navigate({ to: "/" });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete profile."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="sbm-form space-y-6">
      <MemberPageHeader
        kicker={isTe ? "ఖాతా" : "Account"}
        title={isTe ? "ఖాతా అమరికలు" : "Account settings"}
        description={
          isTe
            ? "మీ లాగిన్, సంప్రదింపు వివరాలు, భాష మరియు పాస్‌వర్డ్‌ను నిర్వహించండి."
            : "Manage your login, personal contact details, language and password."
        }
      />

      <div className="space-y-6">
        {/* Language Preference Card */}
        <Card className="rounded-3xl border border-[#D1A329]/25 bg-white shadow-xs overflow-hidden">
          <CardHeader className="border-b border-[#D1A329]/15 bg-gradient-to-r from-[#24103F]/5 to-transparent pb-4">
            <div className="flex items-center gap-2.5">
              <Globe className="h-5 w-5 text-[#D1A329]" />
              <CardTitle className="font-serif text-xl font-bold text-[#24103F]">
                {isTe ? "భాషా ప్రాధాన్యత" : "Language Preference"}
              </CardTitle>
            </div>
            <CardDescription>
              {isTe
                ? "ఈ వేదికను తెలుగు లేదా ఇంగ్లీషులో వీక్షించండి."
                : "Choose your primary language for browsing profiles and navigation."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  lang === "en"
                    ? "bg-[#24103F] text-white border-[#24103F] shadow-sm"
                    : "bg-white text-[#24103F] border-[#ded5c8] hover:border-[#D1A329]"
                }`}
              >
                <span>English</span>
                {lang === "en" ? <span className="text-xs text-[#D1A329]">✓ Active</span> : null}
              </button>
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  lang === "te"
                    ? "bg-[#24103F] text-white border-[#24103F] shadow-sm"
                    : "bg-white text-[#24103F] border-[#ded5c8] hover:border-[#D1A329]"
                }`}
              >
                <span>తెలుగు (Telugu)</span>
                {lang === "te" ? <span className="text-xs text-[#D1A329]">✓ Active</span> : null}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="rounded-3xl border border-[#D1A329]/25 bg-white shadow-xs overflow-hidden">
          <CardHeader className="border-b border-[#D1A329]/15 bg-gradient-to-r from-[#24103F]/5 to-transparent pb-4">
            <div className="flex items-center gap-2.5">
              <User className="h-5 w-5 text-[#D1A329]" />
              <CardTitle className="font-serif text-xl font-bold text-[#24103F]">
                {isTe ? "ఖాతా సమాచారం" : "Account Information"}
              </CardTitle>
            </div>
            <CardDescription>
              {isTe
                ? "ప్రాథమిక లాగిన్ మరియు సంప్రదింపు వివరాలు"
                : "Primary login and contact details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAccountUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="set-name">{isTe ? "పూర్తి పేరు" : "Full Name"}</Label>
                  <Input
                    id="set-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={savingAccount}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="set-email">{isTe ? "ఇమెయిల్ చిరునామా" : "Email Address"}</Label>
                  <Input
                    id="set-email"
                    value={user?.email ?? ""}
                    disabled
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-1.5 max-w-sm">
                <Label htmlFor="set-phone">{isTe ? "మొబైల్ నంబర్" : "Phone Number"}</Label>
                <Input
                  id="set-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={savingAccount}
                />
              </div>

              <Button
                type="submit"
                disabled={savingAccount}
                className="bg-gradient-to-r from-[#087333] to-[#087333] hover:from-[#034B21] hover:to-[#087333] text-white font-bold shadow-xs border border-[#D1A329]/30"
              >
                {savingAccount
                  ? isTe
                    ? "భద్రపరుస్తోంది..."
                    : "Saving..."
                  : isTe
                    ? "మార్పులను భద్రపరచండి"
                    : "Save Account Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="rounded-3xl border border-[#D1A329]/25 bg-white shadow-xs overflow-hidden">
          <CardHeader className="border-b border-[#D1A329]/15 bg-gradient-to-r from-[#24103F]/5 to-transparent pb-4">
            <div className="flex items-center gap-2.5">
              <KeyRound className="h-5 w-5 text-[#D1A329]" />
              <CardTitle className="font-serif text-xl font-bold text-[#24103F]">
                {isTe ? "పాస్‌వర్డ్ మార్చండి" : "Change Password"}
              </CardTitle>
            </div>
            <CardDescription>
              {isTe
                ? "బలమైన పాస్‌వర్డ్‌తో మీ ఖాతాను సురక్షితంగా ఉంచండి"
                : "Keep your account secure with a strong password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label htmlFor="set-pass">{isTe ? "కొత్త పాస్‌వర్డ్" : "New Password"}</Label>
                <Input
                  id="set-pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={savingPassword}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="set-cpass">
                  {isTe ? "కొత్త పాస్‌వర్డ్‌ను నిర్ధారించండి" : "Confirm New Password"}
                </Label>
                <Input
                  id="set-cpass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={savingPassword}
                />
              </div>

              <Button
                type="submit"
                disabled={savingPassword}
                className="bg-[#24103F] hover:bg-[#351064] text-white font-bold shadow-xs"
              >
                {savingPassword
                  ? isTe
                    ? "నవీకరిస్తోంది..."
                    : "Updating..."
                  : isTe
                    ? "పాస్‌వర్డ్ అప్‌డేట్ చేయండి"
                    : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lifecycle & Safety: Pause & Delete */}
        <Card className="rounded-3xl border border-[#ded5c8] bg-white overflow-hidden shadow-xs">
          <CardHeader className="border-b border-[#ded5c8] pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-[#6B6570]" />
              <CardTitle className="font-serif text-xl font-bold text-[#24103F]">
                {isTe ? "ఖాతా స్థితి మరియు నిర్వహణ" : "Account Status & Actions"}
              </CardTitle>
            </div>
            <CardDescription>
              {isTe
                ? "మీ ప్రొఫైల్‌ను తాత్కాలికంగా దాచండి లేదా శాశ్వతంగా తొలగించండి."
                : "Temporarily pause your matrimonial introduction or sign out from this device."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded5c8] pb-5">
              <div>
                <p className="font-semibold text-[#24103F]">
                  {isTe ? "ప్రొఫైల్‌ను తాత్కాలికంగా దాచండి" : "Pause Profile Visibility"}
                </p>
                <p className="text-xs text-[#6B6570] mt-0.5">
                  {isTe
                    ? "మీ ప్రొఫైల్ అన్వేషణ మరియు సిఫార్సుల నుండి తాత్కాలికంగా దాచబడుతుంది."
                    : "Hide your profile from discovery while keeping your saved data intact."}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-[#ded5c8] text-[#24103F] shrink-0">
                    <PauseCircle className="mr-1.5 h-4 w-4 text-[#D1A329]" />
                    {isTe ? "తాత్కాలికంగా దాచండి" : "Pause Profile"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border border-[#ded5c8]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-serif text-xl text-[#24103F]">
                      {isTe ? "ప్రొఫైల్‌ను దాచాలనుకుంటున్నారా?" : "Pause profile visibility?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {isTe
                        ? "మీ ప్రొఫైల్ ఇతర సభ్యులకు కనిపించదు. మీరు మళ్లీ లాగిన్ అయినప్పుడు దీన్ని మార్చుకోవచ్చు."
                        : "Your matrimonial profile will not appear in search or discovery until you re-enable it. Your photos and details remain safe."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{isTe ? "రద్దు" : "Cancel"}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivate}
                      className="bg-[#24103F] text-white hover:bg-[#351064]"
                    >
                      {isTe ? "అవును, దాచండి" : "Yes, Pause Profile"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded5c8] pb-5">
              <div>
                <p className="font-semibold text-rose-800">
                  {isTe ? "ప్రొఫైల్‌ను శాశ్వతంగా తొలగించండి" : "Delete Matrimonial Profile"}
                </p>
                <p className="text-xs text-[#6B6570] mt-0.5">
                  {isTe
                    ? "మీ ప్రొఫైల్ వివరాలు, ప్రాధాన్యతలు మరియు ఫోటోలు శాశ్వతంగా తీసివేయబడతాయి."
                    : "Permanently delete your profile details, photo gallery, and introduction history."}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-700 hover:bg-rose-50 shrink-0"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    {isTe ? "ప్రొఫైల్ తొలగించండి" : "Delete Profile"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border border-rose-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-serif text-xl text-rose-700">
                      {isTe
                        ? "ఖాతాను ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?"
                        : "Are you absolutely sure?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {isTe
                        ? "ఈ చర్యను రద్దు చేయడం సాధ్యం కాదు. మీ సమాచారం మొత్తం పూర్తిగా తీసివేయబడుతుంది."
                        : "This action cannot be undone. This will permanently delete your matrimonial profile, photo uploads, interests and shortlist records."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{isTe ? "రద్దు" : "Cancel"}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-rose-600 text-white hover:bg-rose-700"
                    >
                      {isTe ? "శాశ్వతంగా తొలగించండి" : "Yes, Delete Permanently"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <p className="font-semibold text-[#24103F]">{isTe ? "లాగౌట్" : "Sign Out"}</p>
                <p className="text-xs text-[#6B6570] mt-0.5">
                  {isTe
                    ? "ఈ పరికరం నుండి మీ ఖాతా సెషన్‌ను ముగించండి."
                    : "End your current secure session on this device."}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#ded5c8] text-[#24103F] hover:bg-[#FAF8F3] shrink-0"
                onClick={() => void signOut()}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                {isTe ? "లాగౌట్ అవ్వండి" : "Sign Out"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
