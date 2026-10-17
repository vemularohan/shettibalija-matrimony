import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

// Editorial profile portraits — warm, professional, community-rooted
const EDITORIAL_PORTRAITS = [
  {
    id: "p1",
    name: "Harshita",
    nameTe: "హర్షిత",
    age: 26,
    location: "Hyderabad",
    locationTe: "హైదరాబాద్",
    image: "/profiles/harshita.jpg",
  },
  {
    id: "p2",
    name: "Ranjit",
    nameTe: "రంజిత్",
    age: 29,
    location: "Vijayawada",
    locationTe: "విజయవాడ",
    image: "/profiles/ranjit.jpg",
  },
  {
    id: "p3",
    name: "Sravani",
    nameTe: "శ్రావణి",
    age: 25,
    location: "Kakinada",
    locationTe: "కాకినాడ",
    image: "/profiles/sravani.jpg",
  },
];

type ProfileFor = "myself" | "daughter" | "son" | "brother" | "sister" | "relative" | "friend";

/** Subtle cursor-tracking parallax for the 3D photo composition */
function useParallax(containerRef: React.RefObject<HTMLDivElement | null>) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientX - cx) / rect.width) * 6; // ±6deg max
      targetY = ((e.clientY - cy) / rect.height) * -4; // ±4deg max
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }

    function animate() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const frame = frameRef.current;
      if (frame) {
        frame.style.transform = `perspective(900px) rotateY(${currentX}deg) rotateX(${currentY}deg)`;
      }
      rafId = requestAnimationFrame(animate);
    }

    container.addEventListener("mousemove", onMouseMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return frameRef;
}

export function HeroPhotoGallery() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useParallax(containerRef);

  // Registration state
  const [profileFor, setProfileFor] = useState<ProfileFor>("myself");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Auto-set gender based on profile relation
  function handleProfileForChange(value: ProfileFor) {
    setProfileFor(value);
    if (value === "daughter" || value === "sister") {
      setGender("female");
    } else if (value === "son" || value === "brother") {
      setGender("male");
    }
  }

  function handleQuickRegister(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error(lang === "te" ? "దయచేసి పేరు నమోదు చేయండి" : "Please enter candidate's full name");
      return;
    }
    const cleanMobile = mobileNumber.replace(/\D/g, "");
    if (cleanMobile.length < 10) {
      toast.error(
        lang === "te"
          ? "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి"
          : "Please enter a valid 10-digit mobile number",
      );
      return;
    }
    if (!termsAccepted) {
      toast.error(
        lang === "te"
          ? "దయచేసి నిబంధనలను అంగీకరించండి"
          : "Please accept the Terms & Privacy Policy to register",
      );
      return;
    }

    // Direct user to complete authenticated registration with prefilled profile details
    void navigate({
      to: "/register",
      search: {
        name: fullName.trim(),
        mobile: cleanMobile,
        gender: gender === "male" ? "groom" : "bride",
        profileFor,
      },
    });
  }

  const p0 = EDITORIAL_PORTRAITS[0]!;
  const p1 = EDITORIAL_PORTRAITS[1]!;
  const p2 = EDITORIAL_PORTRAITS[2]!;

  const profileForOptions: { value: ProfileFor; labelEn: string; labelTe: string }[] = [
    { value: "myself", labelEn: "Myself", labelTe: "నా కోసం" },
    { value: "daughter", labelEn: "Daughter", labelTe: "కుమార్తె" },
    { value: "son", labelEn: "Son", labelTe: "కుమారుడు" },
    { value: "brother", labelEn: "Brother", labelTe: "సోదరుడు" },
    { value: "sister", labelEn: "Sister", labelTe: "సోదరి" },
    { value: "relative", labelEn: "Relative", labelTe: "బంధువు" },
    { value: "friend", labelEn: "Friend", labelTe: "స్నేహితుడు" },
  ];

  return (
    <section className="relative bg-[#FAF8F3] pt-14 pb-12 sm:pb-16 overflow-hidden">
      {/* Background warm subtle ambient radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 0%, rgba(209,163,41,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Top architectural gold decorative rule */}
      <div
        className="absolute top-14 left-0 right-0 ornament-line"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(209,163,41,0.25) 20%, rgba(209,163,41,0.25) 80%, transparent 100%)",
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-[#D1A329]/60 bg-[#FAF8F3] px-2 leading-none">
          ◆
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-14 pt-10 sm:pt-14 pb-6">
          {/* ——— LEFT COLUMN: Matrimonial Headline & Real Registration Card ——— */}
          <div className="flex-1 max-w-2xl">
            {/* Brand Crest / Plaque */}
            <div className="inline-flex items-center gap-3 mb-5 plaque rounded-lg px-3.5 py-2">
              <ShettibalijaLogo size="xs" priority imgClassName="opacity-95" />
              <div className="flex flex-col leading-none">
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
                  {SITE_NAME}
                </span>
                <span className="text-[9px] font-medium tracking-[0.08em] text-[#D1A329] mt-0.5">
                  Shettibalija Sangham Official Portal
                </span>
              </div>
            </div>

            {/* Matrimonial Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-semibold text-[#242024] leading-[1.12] tracking-tight">
              {lang === "te" ? (
                <>
                  మీ విలువలను పంచుకునే
                  <br />
                  <span className="text-[#24103F]">జీవిత భాగస్వామిని</span> కనుగొనండి.
                </>
              ) : (
                <>
                  Find a life partner
                  <br />
                  <span className="text-[#24103F]">who shares your values.</span>
                </>
              )}
            </h1>

            {/* Supporting Copy */}
            <p className="mt-3.5 text-sm sm:text-base text-[#6B6570] leading-relaxed max-w-xl">
              {lang === "te"
                ? "శెట్టిబలిజ కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడిన విశ్వసనీయ వివాహ వేదిక. పవిత్రమైన సంప్రదాయాలు మరియు కుటుంబ విలువల కలయిక."
                : "A trusted matrimonial platform created for the Shettibalija community. Meaningful relationships built on shared values, culture, and family trust."}
            </p>

            {/* ——— PRIMARY REGISTRATION INTERACTION (Real Working Form) ——— */}
            <div
              className="mt-6 rounded-xl bg-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(36,16,63,0.06),0_1px_3px_rgba(36,16,63,0.04)] border border-[#E4DDD3] relative"
              style={{
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.95), 0 8px 24px rgba(36,16,63,0.06), 0 0 0 1px rgba(209,163,41,0.18)",
              }}
            >
              {/* Subtle gold corner accents */}
              <span
                className="arch-corner arch-corner-tl"
                style={{ width: 14, height: 14, top: 6, left: 6 }}
              />
              <span
                className="arch-corner arch-corner-tr"
                style={{ width: 14, height: 14, top: 6, right: 6 }}
              />

              <div className="flex items-center justify-between border-b border-[#E4DDD3] pb-3 mb-4">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#24103F] flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-[#087333]" />
                    {lang === "te"
                      ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్ సృష్టించండి"
                      : "Create Your Matrimony Profile"}
                  </h2>
                  <p className="text-xs text-[#6B6570] mt-0.5">
                    {lang === "te"
                      ? "ఉచితంగా రిజిస్టర్ అవ్వండి మరియు తగిన సంబంధాలను చూడండి"
                      : "Register Free & Connect with Verified Shettibalija Families"}
                  </p>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#087333]/10 text-[#087333] border border-[#087333]/25">
                  100% Free
                </span>
              </div>

              <form onSubmit={handleQuickRegister} className="space-y-4">
                {/* 1. Profile Created For */}
                <div>
                  <Label className="text-xs font-semibold text-[#242024] block mb-2">
                    {lang === "te" ? "ప్రొఫైల్ ఎవరి కోసం:" : "Profile created for:"}
                  </Label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {profileForOptions.map((opt) => {
                      const selected = profileFor === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleProfileForChange(opt.value)}
                          className={`px-3 py-1.5 text-xs rounded-md transition-all duration-150 font-medium ${
                            selected
                              ? "bg-[#24103F] text-white shadow-xs font-semibold"
                              : "bg-[#F5F2EB] text-[#4A4550] hover:bg-[#EAE4D8] border border-[#E4DDD3]"
                          }`}
                        >
                          {lang === "te" ? opt.labelTe : opt.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Gender & Name in responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  <div className="sm:col-span-5">
                    <Label className="text-xs font-semibold text-[#242024] block mb-1.5">
                      {lang === "te" ? "లింగం:" : "Gender:"}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`h-9 text-xs rounded-md border flex items-center justify-center font-medium transition-all ${
                          gender === "male"
                            ? "bg-[#24103F] text-white border-[#24103F] font-semibold"
                            : "bg-white text-[#4A4550] border-[#E4DDD3] hover:bg-[#FAF8F3]"
                        }`}
                      >
                        {lang === "te" ? "వరుడు (Male)" : "Male (Groom)"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`h-9 text-xs rounded-md border flex items-center justify-center font-medium transition-all ${
                          gender === "female"
                            ? "bg-[#24103F] text-white border-[#24103F] font-semibold"
                            : "bg-white text-[#4A4550] border-[#E4DDD3] hover:bg-[#FAF8F3]"
                        }`}
                      >
                        {lang === "te" ? "వధువు (Female)" : "Female (Bride)"}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-7">
                    <Label
                      htmlFor="hero-fullname"
                      className="text-xs font-semibold text-[#242024] block mb-1.5"
                    >
                      {lang === "te" ? "అభ్యర్థి పూర్తి పేరు:" : "Candidate's Full Name:"}
                    </Label>
                    <Input
                      id="hero-fullname"
                      type="text"
                      placeholder={
                        lang === "te"
                          ? "పూర్తి పేరు నమోదు చేయండి"
                          : "e.g. Ananya Rao / Sravan Kumar"
                      }
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-9 text-xs bg-white border-[#E4DDD3] focus-visible:ring-1 focus-visible:ring-[#24103F]"
                    />
                  </div>
                </div>

                {/* 3. Mobile Number */}
                <div>
                  <Label
                    htmlFor="hero-mobile"
                    className="text-xs font-semibold text-[#242024] block mb-1.5"
                  >
                    {lang === "te" ? "మొబైల్ నంబర్:" : "Mobile Number:"}
                  </Label>
                  <div className="flex items-center">
                    <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 border-[#E4DDD3] bg-[#F5F2EB] px-3 text-xs font-medium text-[#6B6570]">
                      +91
                    </span>
                    <Input
                      id="hero-mobile"
                      type="tel"
                      maxLength={10}
                      placeholder={
                        lang === "te" ? "10 అంకెల మొబైల్ నంబర్" : "10-digit mobile number"
                      }
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      className="h-9 rounded-l-none text-xs bg-white border-[#E4DDD3] focus-visible:ring-1 focus-visible:ring-[#24103F]"
                    />
                  </div>
                </div>

                {/* 4. Consent */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="hero-terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-[#E4DDD3] text-[#24103F] focus:ring-[#24103F]"
                  />
                  <Label
                    htmlFor="hero-terms"
                    className="text-[11px] text-[#6B6570] leading-tight cursor-pointer"
                  >
                    {lang === "te" ? (
                      <>
                        నేను{" "}
                        <Link to="/terms" className="underline text-[#24103F]">
                          నిబంధనలు
                        </Link>{" "}
                        మరియు{" "}
                        <Link to="/privacy" className="underline text-[#24103F]">
                          గోప్యతా విధానం
                        </Link>
                        ను అంగీకరిస్తున్నాను.
                      </>
                    ) : (
                      <>
                        I agree to the{" "}
                        <Link to="/terms" className="underline text-[#24103F]">
                          Terms of Use
                        </Link>{" "}
                        &amp;{" "}
                        <Link to="/privacy" className="underline text-[#24103F]">
                          Privacy Policy
                        </Link>
                        .
                      </>
                    )}
                  </Label>
                </div>

                {/* 5. CTAs: Register Free / Send OTP */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <Button
                    type="submit"
                    className="w-full sm:flex-1 h-10 rounded-md bg-[#24103F] text-xs sm:text-sm font-semibold text-white hover:bg-[#311552] transition-colors shadow-sm"
                  >
                    {lang === "te" ? "ఉచితంగా రిజిస్టర్ అవ్వండి / Send OTP" : "Register Free • Send OTP"}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto h-10 rounded-md border-[#E4DDD3] text-xs text-[#242024] hover:border-[#24103F] hover:bg-transparent"
                  >
                    <Link to="/search">
                      {lang === "te" ? "ప్రొఫైల్స్ చూడండి" : "Browse Matches"}
                    </Link>
                  </Button>
                </div>
              </form>

              {/* Trust Footer inside Registration card */}
              <div className="mt-3 pt-3 border-t border-[#E4DDD3]/60 flex items-center justify-between text-[10px] text-[#6B6570]">
                <span className="flex items-center gap-1 text-[#087333] font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#087333]" />
                  Verified Shettibalija Profiles
                </span>
                <span>Privacy &amp; Data Protected</span>
              </div>
            </div>
          </div>

          {/* ——— RIGHT: Editorial Matrimonial Portrait Composition ——— */}
          <div className="flex-1 flex justify-center lg:justify-end mt-4 lg:mt-0" ref={containerRef}>
            {/* Desktop — 3D parallax architectural photo frame */}
            <div
              ref={frameRef}
              className="hidden md:block relative"
              style={{
                width: 420,
                height: 480,
                transformStyle: "preserve-3d",
                willChange: "transform",
                transition: "transform 0.1s linear",
              }}
            >
              {/* Architectural outer frame */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  border: "1px solid rgba(209,163,41,0.25)",
                  boxShadow:
                    "0 0 0 8px rgba(209,163,41,0.04), 0 2px 2px rgba(209,163,41,0.08)",
                }}
              >
                {/* Four gold corner brackets */}
                <span className="arch-corner arch-corner-tl" />
                <span className="arch-corner arch-corner-tr" />
                <span className="arch-corner arch-corner-bl" />
                <span className="arch-corner arch-corner-br" />
              </div>

              {/* Main portrait — left, large */}
              <div
                className="absolute overflow-hidden rounded-lg bg-[#E4DDD3]"
                style={{
                  left: 20,
                  top: 24,
                  width: 220,
                  height: 310,
                  boxShadow:
                    "0 4px 12px rgba(36,16,63,0.08), 0 12px 32px rgba(36,16,63,0.10), 2px 0 0 rgba(255,255,255,0.6) inset",
                  transform: "translateZ(12px)",
                }}
              >
                <img
                  src={p0.image}
                  alt={p0.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                  style={{ transition: "transform 0.6s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                {/* Caption — printed photo label style */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-3">
                  <p className="text-white text-sm font-medium leading-tight">
                    {lang === "te" ? p0.nameTe : p0.name}
                  </p>
                  <p className="text-white/70 text-[11px]">
                    {p0.age} · {lang === "te" ? p0.locationTe : p0.location}
                  </p>
                </div>
              </div>

              {/* Portrait 2 — top right */}
              <div
                className="absolute overflow-hidden rounded-lg bg-[#E4DDD3]"
                style={{
                  right: 20,
                  top: 24,
                  width: 152,
                  height: 190,
                  boxShadow:
                    "0 4px 10px rgba(36,16,63,0.07), 0 10px 24px rgba(36,16,63,0.09), 2px 0 0 rgba(255,255,255,0.5) inset",
                  transform: "translateZ(20px)",
                }}
              >
                <img
                  src={p1.image}
                  alt={p1.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                  style={{ transition: "transform 0.6s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-2.5">
                  <p className="text-white text-xs font-medium">
                    {lang === "te" ? p1.nameTe : p1.name}
                  </p>
                  <p className="text-white/65 text-[10px]">
                    {p1.age} · {lang === "te" ? p1.locationTe : p1.location}
                  </p>
                </div>
              </div>

              {/* Portrait 3 — bottom right, slightly offset */}
              <div
                className="absolute overflow-hidden rounded-lg bg-[#E4DDD3]"
                style={{
                  right: 20,
                  bottom: 24,
                  width: 152,
                  height: 175,
                  boxShadow:
                    "0 4px 10px rgba(36,16,63,0.07), 0 10px 24px rgba(36,16,63,0.09), 2px 0 0 rgba(255,255,255,0.5) inset",
                  transform: "translateZ(8px)",
                }}
              >
                <img
                  src={p2.image}
                  alt={p2.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                  style={{ transition: "transform 0.6s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-2.5">
                  <p className="text-white text-xs font-medium">
                    {lang === "te" ? p2.nameTe : p2.name}
                  </p>
                  <p className="text-white/65 text-[10px]">
                    {p2.age} · {lang === "te" ? p2.locationTe : p2.location}
                  </p>
                </div>
              </div>

              {/* Subtle "shadow plane" */}
              <div
                className="absolute inset-x-4 bottom-0 rounded-full"
                style={{
                  height: 24,
                  background:
                    "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(36,16,63,0.12) 0%, transparent 100%)",
                  transform: "translateZ(-4px) translateY(10px)",
                  filter: "blur(6px)",
                }}
              />

              {/* Decorative small gold diamond separator */}
              <div
                className="absolute flex items-center justify-center"
                style={{ right: 88, top: 236, width: 16, height: 8 }}
              >
                <span className="text-[#D1A329]/50 text-[8px]">◆</span>
              </div>
            </div>

            {/* Mobile — single portrait, editorial layout */}
            <div className="md:hidden w-full max-w-xs mx-auto">
              <div
                className="relative overflow-hidden rounded-xl bg-[#E4DDD3]"
                style={{
                  aspectRatio: "3/4",
                  boxShadow: "0 4px 12px rgba(36,16,63,0.08), 0 16px 32px rgba(36,16,63,0.10)",
                }}
              >
                {/* Architectural corner brackets */}
                <span
                  className="arch-corner arch-corner-tl"
                  style={{ width: 18, height: 18, top: 8, left: 8 }}
                />
                <span
                  className="arch-corner arch-corner-tr"
                  style={{ width: 18, height: 18, top: 8, right: 8 }}
                />
                <span
                  className="arch-corner arch-corner-bl"
                  style={{ width: 18, height: 18, bottom: 8, left: 8 }}
                />
                <span
                  className="arch-corner arch-corner-br"
                  style={{ width: 18, height: 18, bottom: 8, right: 8 }}
                />

                <img
                  src={p0.image}
                  alt={p0.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-4">
                  <p className="text-white text-base font-medium">
                    {lang === "te" ? p0.nameTe : p0.name}
                  </p>
                  <p className="text-white/70 text-xs">
                    {p0.age} · {lang === "te" ? p0.locationTe : p0.location}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#087333] font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Shettibalija Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ornament rule */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(228,221,211,1) 20%, rgba(228,221,211,1) 80%, transparent 100%)",
        }}
      />
    </section>
  );
}
