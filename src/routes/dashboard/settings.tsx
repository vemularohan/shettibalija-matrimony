import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { KeyRound, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/dashboard/settings")({
  component: DashboardSettingsPage,
});

export function DashboardSettingsPage() {
  const { user, account, refreshAccount, signOut } = useAuth();
  const [fullName, setFullName] = useState(account?.full_name ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [savingAccount, setSavingAccount] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

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
      toast.success("Account profile updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update account."));
    } finally {
      setSavingAccount(false);
    }
  }

  async function handlePasswordUpdate(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update password."));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Account Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your login credentials, personal contact, and security preferences.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-xl">Account Information</CardTitle>
            </div>
            <CardDescription>Primary login and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccountUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="set-name">Full Name</Label>
                  <Input
                    id="set-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={savingAccount}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="set-email">Email Address</Label>
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
                <Label htmlFor="set-phone">Phone Number</Label>
                <Input
                  id="set-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={savingAccount}
                />
              </div>

              <Button type="submit" disabled={savingAccount}>
                {savingAccount ? "Saving..." : "Save Account Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="font-serif text-xl">Change Password</CardTitle>
            </div>
            <CardDescription>Keep your account secure with a strong password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label htmlFor="set-pass">New Password</Label>
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
                <Label htmlFor="set-cpass">Confirm New Password</Label>
                <Input
                  id="set-cpass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={savingPassword}
                />
              </div>

              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-destructive">Sign Out</CardTitle>
            <CardDescription>Sign out of your session on this device</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => void signOut()}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Sign Out from Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
