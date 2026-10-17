import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";
import { useEffect, useRef } from "react";

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
      targetX = ((e.clientX - cx) / rect.width) * 6;   // ±6deg max
      targetY = ((e.clientY - cy) / rect.height) * -4;  // ±4deg max
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }

    function animate() {
      // Lerp for smooth trailing
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
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useParallax(containerRef);
  const p0 = EDITORIAL_PORTRAITS[0]!;
  const p1 = EDITORIAL_PORTRAITS[1]!;
  const p2 = EDITORIAL_PORTRAITS[2]!;

  return (
    <section className="relative bg-[#FAF8F3] pt-14 overflow-hidden">
      {/* Very subtle warm texture — radial highlight top center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 0%, rgba(209,163,41,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Architectural ornament — top horizontal rule with diamond center */}
      <div className="absolute top-14 left-0 right-0 ornament-line" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(209,163,41,0.25) 20%, rgba(209,163,41,0.25) 80%, transparent 100%)" }}>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-[#D1A329]/60 bg-[#FAF8F3] px-2 leading-none">◆</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20 py-16 lg:py-24">

          {/* ——— LEFT: Editorial Copy Column ——— */}
          <div className="flex-1 max-w-xl">

            {/* Brand plaque — logo in embossed crest */}
            <div className="inline-flex items-center gap-3 mb-7 plaque rounded-lg px-4 py-2.5">
              <ShettibalijaLogo size="sm" priority imgClassName="opacity-90" />
              <div className="flex flex-col leading-none">
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
                  {SITE_NAME}
                </span>
                <span className="text-[9px] font-medium tracking-[0.08em] text-[#D1A329] mt-0.5">
                  Shettibalija Sangham
                </span>
              </div>
            </div>

            {/* Architectural gold accent rule */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-gradient-to-r from-[#D1A329] to-transparent" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#D1A329]/70">
                Est. Telugu Community
              </span>
            </div>

            {/* Headline — large serif, editorial weight */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-semibold text-[#242024] leading-[1.08] tracking-tight">
              {lang === "te" ? (
                <>
                  ఇంటిలా అనిపించే
                  <br />
                  <span className="text-[#24103F]">జీవిత భాగస్వామిని</span>
                  <br />
                  కనుగొనండి.
                </>
              ) : (
                <>
                  Find a partner
                  <br />
                  <span className="text-[#24103F]">who feels</span>
                  <br />
                  like home.
                </>
              )}
            </h1>

            {/* Subtle separator after headline */}
            <div className="mt-6 mb-6 flex items-center gap-2">
              <div className="w-5 h-px bg-[#E4DDD3]" />
              <div className="w-1 h-1 rounded-full bg-[#D1A329]/50" />
              <div className="flex-1 h-px bg-[#E4DDD3] max-w-[80px]" />
            </div>

            {/* Description */}
            <p className="text-[15px] text-[#6B6570] leading-relaxed max-w-md">
              {lang === "te"
                ? "శెట్టిబలిజ కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడిన విశ్వసనీయ వివాహ వేదిక."
                : "A trusted matrimonial platform created for the Shettibalija community. Meaningful relationships built on shared values and family trust."}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="h-11 rounded-md bg-[#24103F] px-7 text-sm font-semibold text-white hover:bg-[#311552] transition-colors shadow-[0_2px_8px_rgba(36,16,63,0.2)]"
              >
                <Link to="/register">
                  {lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create Your Profile"}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-md border-[#E4DDD3] px-6 text-sm font-medium text-[#242024] hover:border-[#24103F] hover:bg-transparent transition-colors"
              >
                <Link to="/search" className="flex items-center gap-2">
                  {lang === "te" ? "ప్రొఫైల్స్ చూడండి" : "Explore Matches"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trust note */}
            <p className="mt-8 text-[11px] text-[#B0A8B8] font-medium tracking-wide">
              {lang === "te"
                ? "వెరిఫై చేయబడిన శెట్టిబలిజ కమ్యూనిటీ  •  గోప్యత రక్షణ"
                : "Verified Shettibalija Community  •  Privacy Protected"}
            </p>
          </div>

          {/* ——— RIGHT: 3D Photo Composition with Architectural Frame ——— */}
          <div className="flex-1 flex justify-center lg:justify-end" ref={containerRef}>

            {/* Desktop — 3D parallax architectural photo frame */}
            <div
              ref={frameRef}
              className="hidden md:block relative"
              style={{
                width: 420,
                height: 500,
                transformStyle: "preserve-3d",
                willChange: "transform",
                transition: "transform 0.1s linear",
              }}
            >
              {/* Architectural outer frame */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  border: "1px solid rgba(209,163,41,0.2)",
                  boxShadow: "0 0 0 8px rgba(209,163,41,0.04), 0 2px 2px rgba(209,163,41,0.08)",
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
                  left: 24,
                  top: 32,
                  width: 220,
                  height: 320,
                  boxShadow: "0 4px 12px rgba(36,16,63,0.08), 0 12px 32px rgba(36,16,63,0.10), 2px 0 0 rgba(255,255,255,0.6) inset",
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
                  right: 24,
                  top: 32,
                  width: 148,
                  height: 195,
                  boxShadow: "0 4px 10px rgba(36,16,63,0.07), 0 10px 24px rgba(36,16,63,0.09), 2px 0 0 rgba(255,255,255,0.5) inset",
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
                  right: 24,
                  bottom: 32,
                  width: 148,
                  height: 178,
                  boxShadow: "0 4px 10px rgba(36,16,63,0.07), 0 10px 24px rgba(36,16,63,0.09), 2px 0 0 rgba(255,255,255,0.5) inset",
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

              {/* Subtle "shadow plane" — the surface the photos rest on */}
              <div
                className="absolute inset-x-4 bottom-0 rounded-full"
                style={{
                  height: 24,
                  background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(36,16,63,0.12) 0%, transparent 100%)",
                  transform: "translateZ(-4px) translateY(10px)",
                  filter: "blur(6px)",
                }}
              />

              {/* Decorative small gold diamond separator between right portraits */}
              <div
                className="absolute flex items-center justify-center"
                style={{ right: 92, top: 248, width: 16, height: 8 }}
              >
                <span className="text-[#D1A329]/50 text-[8px]">◆</span>
              </div>
            </div>

            {/* Mobile — single portrait, editorial layout */}
            <div className="md:hidden w-full max-w-xs">
              <div
                className="relative overflow-hidden rounded-xl bg-[#E4DDD3]"
                style={{
                  aspectRatio: "3/4",
                  boxShadow: "0 4px 12px rgba(36,16,63,0.08), 0 16px 32px rgba(36,16,63,0.10)",
                }}
              >
                {/* Architectural corner brackets */}
                <span className="arch-corner arch-corner-tl" style={{ width: 20, height: 20, top: 8, left: 8 }} />
                <span className="arch-corner arch-corner-tr" style={{ width: 20, height: 20, top: 8, right: 8 }} />
                <span className="arch-corner arch-corner-bl" style={{ width: 20, height: 20, bottom: 8, left: 8 }} />
                <span className="arch-corner arch-corner-br" style={{ width: 20, height: 20, bottom: 8, right: 8 }} />

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
                  <p className="text-white/70 text-sm">
                    {p0.age} · {lang === "te" ? p0.locationTe : p0.location}
                  </p>
                </div>
              </div>
              <Link
                to="/search"
                className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-[#087333] hover:text-[#24103F] transition-colors"
              >
                {lang === "te" ? "అన్ని ప్రొఫైల్స్ చూడండి" : "View all profiles"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ornament rule */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(228,221,211,1) 20%, rgba(228,221,211,1) 80%, transparent 100%)" }} />
    </section>
  );
}
