import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

// Profile portrait data for right-column editorial collage
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

export function HeroPhotoGallery() {
  const { lang } = useLanguage();

  return (
    <section className="relative bg-[#FAF8F3] pt-14 overflow-hidden">
      {/* Subtle top border accent line */}
      <div className="absolute top-14 left-0 right-0 h-px bg-[#E4DDD3]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16 py-16 lg:py-24">
          {/* ——— LEFT: Editorial Copy ——— */}
          <div className="flex-1 max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <ShettibalijaLogo size="sm" priority imgClassName="opacity-90" />
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#087333]">
                {SITE_NAME}
              </span>
            </div>

            {/* Gold accent line */}
            <div className="w-8 h-px bg-[#D1A329] mb-6" />

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#242024] leading-[1.1] tracking-tight">
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

            {/* Description */}
            <p className="mt-6 text-base text-[#6B6570] leading-relaxed max-w-md">
              {lang === "te"
                ? "శెట్టిబలిజ కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడిన విశ్వసనీయ వివాహ వేదిక."
                : "A trusted matrimonial platform created for the Shettibalija community. Meaningful relationships built on shared values and family trust."}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="h-11 rounded-md bg-[#24103F] px-6 text-sm font-semibold text-white hover:bg-[#311552] transition-colors"
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

            {/* Community trust note */}
            <p className="mt-8 text-xs text-[#B0A8B8] font-medium tracking-wide">
              {lang === "te"
                ? "వెరిఫై చేయబడిన శెట్టిబలిజ కమ్యూనిటీ • గోప్యత రక్షణ"
                : "Verified Shettibalija Community  •  Privacy Protected"}
            </p>
          </div>

          {/* ——— RIGHT: Editorial Photo Collage ——— */}
          <div className="flex-1 flex justify-center lg:justify-end">
            {/* Desktop: editorial collage of 3 portraits */}
            <div className="hidden md:grid grid-cols-2 gap-3 max-w-md w-full">
              {/* Large portrait — left column, spans full height */}
              <div className="relative overflow-hidden rounded-lg bg-[#E4DDD3] aspect-[3/4]">
                <img
                  src={EDITORIAL_PORTRAITS[0].image}
                  alt={EDITORIAL_PORTRAITS[0].name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  loading="eager"
                />
                {/* Minimal caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                  <p className="text-white text-sm font-medium">
                    {lang === "te" ? EDITORIAL_PORTRAITS[0].nameTe : EDITORIAL_PORTRAITS[0].name}
                  </p>
                  <p className="text-white/75 text-xs">
                    {EDITORIAL_PORTRAITS[0].age} &bull;{" "}
                    {lang === "te"
                      ? EDITORIAL_PORTRAITS[0].locationTe
                      : EDITORIAL_PORTRAITS[0].location}
                  </p>
                </div>
                {/* Subtle gold corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#D1A329] opacity-60" />
              </div>

              {/* Right column: two stacked portraits */}
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-lg bg-[#E4DDD3] aspect-[3/4] flex-1">
                  <img
                    src={EDITORIAL_PORTRAITS[1].image}
                    alt={EDITORIAL_PORTRAITS[1].name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    loading="eager"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-sm font-medium">
                      {lang === "te" ? EDITORIAL_PORTRAITS[1].nameTe : EDITORIAL_PORTRAITS[1].name}
                    </p>
                    <p className="text-white/75 text-xs">
                      {EDITORIAL_PORTRAITS[1].age} &bull;{" "}
                      {lang === "te"
                        ? EDITORIAL_PORTRAITS[1].locationTe
                        : EDITORIAL_PORTRAITS[1].location}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#D1A329] opacity-60" />
                </div>

                <div className="relative overflow-hidden rounded-lg bg-[#E4DDD3] aspect-[3/4] flex-1">
                  <img
                    src={EDITORIAL_PORTRAITS[2].image}
                    alt={EDITORIAL_PORTRAITS[2].name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    loading="eager"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-sm font-medium">
                      {lang === "te" ? EDITORIAL_PORTRAITS[2].nameTe : EDITORIAL_PORTRAITS[2].name}
                    </p>
                    <p className="text-white/75 text-xs">
                      {EDITORIAL_PORTRAITS[2].age} &bull;{" "}
                      {lang === "te"
                        ? EDITORIAL_PORTRAITS[2].locationTe
                        : EDITORIAL_PORTRAITS[2].location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: single large portrait with editorial caption */}
            <div className="md:hidden w-full max-w-xs">
              <div className="relative overflow-hidden rounded-lg bg-[#E4DDD3] aspect-[3/4]">
                <img
                  src={EDITORIAL_PORTRAITS[0].image}
                  alt={EDITORIAL_PORTRAITS[0].name}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <p className="text-white text-base font-medium">
                    {lang === "te" ? EDITORIAL_PORTRAITS[0].nameTe : EDITORIAL_PORTRAITS[0].name}
                  </p>
                  <p className="text-white/75 text-sm">
                    {EDITORIAL_PORTRAITS[0].age} &bull;{" "}
                    {lang === "te"
                      ? EDITORIAL_PORTRAITS[0].locationTe
                      : EDITORIAL_PORTRAITS[0].location}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D1A329] opacity-60" />
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

      {/* Bottom border */}
      <div className="h-px bg-[#E4DDD3]" />
    </section>
  );
}
