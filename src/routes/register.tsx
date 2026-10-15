import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME, SITE_NAME_TE, COMMUNITY_NAME } from "@/lib/site";
import { EDUCATION_OPTIONS, OCCUPATION_OPTIONS, STATES } from "@/lib/options";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: `Register | ${SITE_NAME}` },
      { name: "description", content: "Create your Shettibalija Matrimony profile" },
    ],
  }),
});

function RegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"bride" | "groom">("bride");
  const [age, setAge] = useState("24");
  const [state, setState] = useState("Andhra Pradesh");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState("B.Tech");
  const [occupation, setOccupation] = useState("Software Professional");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const parsedAge = Number(age);
    if (!parsedAge || parsedAge < 18 || parsedAge > 80) {
      setErrorMessage("Please enter a valid age between 18 and 80.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            gender,
          },
        },
      });

      if (authError) throw authError;

      const newUser = authData.user;
      if (!newUser) {
        throw new Error("Registration failed to create an account.");
      }

      // If user session was immediately established, create their base profile records
      if (authData.session) {
        try {
          await supabase.from("profiles").upsert({
            id: newUser.id,
            full_name: fullName.trim(),
            phone: phone.trim() || null,
            gender,
            account_type: "individual",
          });

          await supabase.from("matrimonial_profiles").insert({
            owner_id: newUser.id,
            display_name: fullName.trim(),
            gender,
            age: parsedAge,
            community: COMMUNITY_NAME,
            state: state || null,
            city: city.trim() || null,
            education: education || null,
            occupation: occupation || null,
            marital_status: "never_married",
            mother_tongue: "Telugu",
            visibility: "visible",
            photo_visibility: "members",
          });
        } catch {
          // If profile insert fails because of RLS or trigger, don't crash registration
        }

        toast.success("Account created successfully!");
        void navigate({ to: "/dashboard" });
      } else {
        setSuccessMessage(
          "Your account has been registered! Please check your email for a confirmation link to activate your account.",
        );
        toast.success("Account registered. Please verify your email.");
      }
    } catch (err) {
      const msg = getErrorMessage(err, "Could not create account. Please try again.");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 bg-muted/30">
      <Card className="w-full max-w-xl shadow-md">
        <CardHeader className="text-center space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-foreground">
            {SITE_NAME_TE}
          </p>
          <CardTitle className="font-serif text-3xl text-primary">
            Create Your Matrimony Profile
          </CardTitle>
          <CardDescription>
            Join verified Shettibalija families seeking marriage alliances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div
              className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center text-sm text-emerald-800">
              <p className="font-medium">{successMessage}</p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name">Full Name *</Label>
                  <Input
                    id="reg-name"
                    required
                    placeholder="Enter candidate name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-gender">Profile For *</Label>
                  <select
                    id="reg-gender"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "bride" | "groom")}
                    disabled={submitting}
                  >
                    <option value="bride">Bride (Female)</option>
                    <option value="groom">Groom (Male)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email Address *</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-age">Age (Years) *</Label>
                  <Input
                    id="reg-age"
                    type="number"
                    min={18}
                    max={75}
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Password (min 6 chars) *</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-state">State *</Label>
                  <select
                    id="reg-state"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={submitting}
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-city">City / District</Label>
                  <Input
                    id="reg-city"
                    placeholder="e.g. Hyderabad, Rajahmundry"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-edu">Education</Label>
                  <select
                    id="reg-edu"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    disabled={submitting}
                  >
                    {EDUCATION_OPTIONS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-occ">Occupation</Label>
                  <select
                    id="reg-occ"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    disabled={submitting}
                  >
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating Profile..." : "Register Profile"}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Already registered?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
