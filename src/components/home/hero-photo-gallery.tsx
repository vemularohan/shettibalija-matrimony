import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserRound, ArrowRight, Heart, Sparkles, Languages, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";
import type { PublicProfileCardData } from "@/components/profiles/profile-card";
import { initials, locationLine } from "@/lib/format";

type Props = {
  profiles: PublicProfileCardData[];
};

// Brand gradients for avatars matching the logo (Royal Purple and Deep Green)
const AVATAR_GRADIENTS = [
  "from-[#32105F] via-[#21083F] to-[#15042A]", // Royal purple
  "from-[#087A32] via-[#045522] to-[#023314]", // Deep emerald green
  "from-[#3b126f] via-[#280a4e] to-[#1a0533]", // Imperial purple
  "from-[#0a8a38] via-[#056027] to-[#033b18]", // Rich forest green
  "from-[#2a0e50] via-[#1d0637] to-[#120324]", // Midnight purple
  "from-[#076b2c] via-[#044c1f] to-[#022c12]", // Shettibalija green
];

export function HeroPhotoGallery({ profiles }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lang, setLanguage, t } = useLanguage();

  const [profileFor, setProfileFor] = useState("self");
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");

  function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (profileFor) query.set("for", profileFor);
    if (fullName.trim()) query.set("name", fullName.trim());
    if (mobile.trim()) query.set("mobile", mobile.trim());

    void navigate({
      to: "/register",
      search: () => ({}),
    });

    if (typeof window !== "undefined") {
      window.location.href = `/register?${query.toString()}`;
    }
  }

  // Split profiles into left and right masonry columns for desktop
  const leftCol1 = profiles.slice(0, 3);
  const leftCol2 = profiles.slice(3, 6);
  const rightCol1 = profiles.slice(6, 9);
  const rightCol2 = profiles.slice(9, 12);
  const mobileProfiles = profiles.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#21083F] via-[#2b0c52] to-[#32105F] text-white py-10 md:py-16 border-b border-[#D9A514]/30">
      {/* Decorative Traditional Backdrop Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(217,165,20,0.2) 0%, transparent 55%),
                            radial-gradient(circle at 15% 50%, rgba(8,122,50,0.15) 0%, transparent 40%),
                            radial-gradient(circle at 85% 50%, rgba(217,165,20,0.15) 0%, transparent 40%)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section Official Branding Header */}
        <div className="mb-8 text-center flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3">
            <ShettibalijaLogo size="lg" className="drop-shadow-lg" priority theme="dark" />
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D9A514]/40 bg-black/25 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#F3D36A] mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D9A514]" />
                <span>{SITE_NAME_TE}</span>
                <span className="text-white/40">•</span>
                <span>{SITE_NAME}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                {t("heroHeadline")}
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-base sm:text-lg text-white/90 font-medium px-4 leading-relaxed">
            {t("heroSupportingText")}
          </p>
        </div>

        {/* Desktop Layout: Masonry Photo Grid Surrounding Centered Registration Card */}
        <div className="relative grid items-center gap-6 lg:grid-cols-12">
          {/* LEFT MASONRY COLUMNS (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:col-span-4 lg:grid lg:grid-cols-2 lg:gap-4">
            {/* Left Column 1 */}
            <div className="flex flex-col gap-4 pt-8">
              {leftCol1.map((p, idx) => (
                <GalleryCard
                  key={p.id}
                  profile={p}
                  colorIdx={idx}
                  heightClass={idx === 1 ? "h-56" : "h-44"}
                />
              ))}
            </div>
            {/* Left Column 2 */}
            <div className="flex flex-col gap-4">
              {leftCol2.map((p, idx) => (
                <GalleryCard
                  key={p.id}
                  profile={p}
                  colorIdx={idx + 2}
                  heightClass={idx === 0 ? "h-56" : "h-44"}
                />
              ))}
            </div>
          </div>

          {/* CENTER: PROMINENT REGISTRATION CARD (Pure White Card on Purple) */}
          <div className="z-10 lg:col-span-4 flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-[#D9A514]/30 bg-white p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] text-[#241C2F] transition-all">
              {/* Card Header & Language Toggle */}
              <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#32105F]">
                    {t("heading")}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">{t("subheading")}</p>
                </div>

                {/* Language Switcher */}
                <div className="flex shrink-0 items-center rounded-full border border-border bg-muted/60 p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-full px-2.5 py-1 transition ${
                      lang === "en"
                        ? "bg-[#32105F] text-white shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Switch to English"
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("te")}
                    className={`rounded-full px-2.5 py-1 transition ${
                      lang === "te"
                        ? "bg-[#32105F] text-white shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Switch to Telugu"
                  >
                    తెలుగు
                  </button>
                </div>
              </div>

              {/* Logged in notification (if user is active) */}
              {user ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Logged in as {user.email}</span>
                  </div>
                  <p className="mt-1 text-emerald-800">
                    Registering on behalf of a family member? Fill below, or go directly to your{" "}
                    <Link to="/dashboard" className="font-semibold underline">
                      Dashboard
                    </Link>
                    .
                  </p>
                </div>
              ) : null}

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
                {/* Profile Created For */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-profile-for"
                    className="text-xs font-medium text-foreground/90"
                  >
                    {t("profileFor")}
                  </Label>
                  <select
                    id="reg-profile-for"
                    value={profileFor}
                    onChange={(e) => setProfileFor(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs transition focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="self">{t("self")}</option>
                    <option value="son">{t("son")}</option>
                    <option value="daughter">{t("daughter")}</option>
                    <option value="brother">{t("brother")}</option>
                    <option value="sister">{t("sister")}</option>
                    <option value="relative">{t("relative")}</option>
                    <option value="friend">{t("friend")}</option>
                  </select>
                </div>

                {/* Enter Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="reg-fullname" className="text-xs font-medium text-foreground/90">
                    {t("namePlaceholder")}
                  </Label>
                  <Input
                    id="reg-fullname"
                    type="text"
                    required
                    placeholder={t("namePlaceholder")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 rounded-xl text-sm shadow-xs"
                  />
                </div>

                {/* Mobile Number with Country Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="reg-mobile" className="text-xs font-medium text-foreground/90">
                    {t("mobilePlaceholder")}
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-11 w-28 rounded-xl border border-input bg-background px-2 text-xs font-medium shadow-xs focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      aria-label={t("countryCode")}
                    >
                      <option value="+91">+91 (IND)</option>
                      <option value="+1">+1 (USA)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+61">+61 (AUS)</option>
                    </select>
                    <Input
                      id="reg-mobile"
                      type="tel"
                      required
                      placeholder={t("mobilePlaceholder")}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="h-11 flex-1 rounded-xl text-sm shadow-xs"
                    />
                  </div>
                </div>

                {/* Primary Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 h-12 w-full rounded-xl bg-[#087A32] text-base font-bold tracking-wide text-white shadow-md transition hover:bg-[#045522] hover:shadow-lg active:scale-[0.99] cursor-pointer"
                >
                  <span>{t("registerFree")}</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>

                {/* Terms and Privacy Notice */}
                <p className="text-center text-[11px] leading-relaxed text-muted-foreground pt-1">
                  {t("termsNotice")}{" "}
                  <Link to="/terms" className="underline hover:text-primary transition">
                    {t("termsLink")}
                  </Link>{" "}
                  {t("andText")}{" "}
                  <Link to="/privacy" className="underline hover:text-primary transition">
                    {t("privacyLink")}
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT MASONRY COLUMNS (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:col-span-4 lg:grid lg:grid-cols-2 lg:gap-4">
            {/* Right Column 1 */}
            <div className="flex flex-col gap-4">
              {rightCol1.map((p, idx) => (
                <GalleryCard
                  key={p.id}
                  profile={p}
                  colorIdx={idx + 4}
                  heightClass={idx === 0 ? "h-56" : "h-44"}
                />
              ))}
            </div>
            {/* Right Column 2 (slightly shifted down) */}
            <div className="flex flex-col gap-4 pt-8">
              {rightCol2.map((p, idx) => (
                <GalleryCard
                  key={p.id}
                  profile={p}
                  colorIdx={idx + 1}
                  heightClass={idx === 1 ? "h-56" : "h-44"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE GALLERY SHOWCASE (visible only on mobile/tablet below lg) */}
        <div className="mt-8 lg:hidden">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Recent Community Members
            </span>
            <Link to="/search" className="text-xs font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mobileProfiles.map((p, idx) => (
              <GalleryCard key={p.id} profile={p} colorIdx={idx} heightClass="h-44" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  profile,
  colorIdx = 0,
  heightClass = "h-48",
}: {
  profile: PublicProfileCardData;
  colorIdx?: number;
  heightClass?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const name = profile.display_name ?? "Member";
  const tag =
    profile.interest_tag ??
    (profile.occupation ? `#${profile.occupation.replace(/\s+/g, "")}` : "#Reading");
  const gradientClass = AVATAR_GRADIENTS[colorIdx % AVATAR_GRADIENTS.length];

  return (
    <Link
      to="/profiles/$code"
      params={{ code: profile.profile_code ?? profile.id }}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-white/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${heightClass}`}
    >
      {/* Visual Avatar / Photo Presentation */}
      <div
        className={`relative flex h-full w-full flex-col justify-between bg-gradient-to-br ${gradientClass} p-3 select-none text-white`}
      >
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-1 z-10">
          <span className="rounded-full bg-black/30 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/90">
            {tag}
          </span>
          <span className="rounded-full bg-white/20 p-1 text-white/90 transition group-hover:scale-110 group-hover:bg-white/30">
            <Heart className="h-3 w-3 fill-white/20 text-white" />
          </span>
        </div>

        {/* Center Stylized Monogram */}
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 border border-white/20 shadow-inner backdrop-blur-xs transition group-hover:scale-105">
            <UserRound className="h-6 w-6 text-white/90 stroke-[1.8]" />
          </div>
          <span className="mt-1 font-serif text-sm font-semibold tracking-wider text-white/90">
            {initials(name)}
          </span>
        </div>

        {/* Bottom Details Card Overlay */}
        <div className="z-10 rounded-xl bg-black/40 backdrop-blur-sm p-2 text-left">
          <p className="truncate font-serif text-sm font-semibold text-white leading-tight">
            {name}
          </p>
          <p className="truncate text-[10px] text-white/80">
            {profile.age ?? "—"} yrs •{" "}
            {locationLine(profile.city, profile.state) || "Telugu Family"}
          </p>
        </div>
      </div>
    </Link>
  );
}
