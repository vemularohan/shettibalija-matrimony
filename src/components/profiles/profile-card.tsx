import { useState } from "react";
import { Heart, ArrowRight, MapPin } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { locationLine } from "@/lib/format";
import { cn } from "@/lib/utils";

export type PublicProfileCardData = {
  id: string;
  profile_code: string | null;
  display_name: string | null;
  age: number | null;
  height_cm: number | null;
  education: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  family_summary: string | null;
  is_demo?: boolean | undefined;
  interest_tag?: string | null | undefined;
  photo_url?: string | null | undefined;
  star?: string | null | undefined;
  rashi?: string | null | undefined;
  gothram?: string | null | undefined;
  marital_status?: string | null | undefined;
  about_me?: string | null | undefined;
  gender?: string | null | undefined;
  horoscope_available?: boolean | undefined;
};

export function ProfileCard({
  profile,
  shortlisted,
  interestSent: _interestSent,
  onShortlist,
  onInterest: _onInterest,
  className,
}: {
  profile: PublicProfileCardData;
  shortlisted?: boolean;
  interestSent?: boolean;
  onShortlist?: () => void;
  onInterest?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const [isLikedLocally, setIsLikedLocally] = useState(false);
  const name = profile.display_name ?? "Community Member";
  const isShortlisted = shortlisted ?? isLikedLocally;
  const profileTarget = profile.profile_code ?? profile.id;
  const location = locationLine(profile.city, profile.state);

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsLikedLocally(!isShortlisted);
    onShortlist?.();
  }

  function handleCardClick() {
    void navigate({ to: "/profiles/$code", params: { code: profileTarget } });
  }

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md bg-white cursor-pointer touch-press",
        // Physical depth — like a printed photograph laid on a warm surface
        "depth-card",
        // Subtle warm border
        "border border-[#E4DDD3]",
        // Smooth transition
        "transition-all duration-300",
        className,
      )}
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0EDE6]">
        <ProtectedPhoto
          profileId={profile.id}
          displayName={name}
          photoUrl={profile.photo_url}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          compact
        />

        {/* Gradient overlay — photo print vignette at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Gold architectural corner — top left only, subtle */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: 20, height: 20, borderTop: "1.5px solid rgba(209,163,41,0.5)", borderLeft: "1.5px solid rgba(209,163,41,0.5)" }}
        />

        {/* Shortlist heart */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isShortlisted ? "Remove from shortlist" : "Shortlist"}
          className={cn(
            "absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150",
            "shadow-[0_1px_4px_rgba(0,0,0,0.15)]",
            isShortlisted
              ? "bg-white text-rose-500"
              : "bg-white/85 text-[#6B6570] hover:text-rose-500",
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", isShortlisted && "fill-rose-500")} />
        </button>

        {/* Bottom caption — printed photo label */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="text-sm font-semibold leading-tight">
            {name}
            <span className="font-normal opacity-80">, {profile.age ?? "—"}</span>
          </p>
          {location && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              {location}
            </p>
          )}
        </div>
      </div>

      {/* Minimal card footer — printed label area */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-t border-[#E4DDD3]"
        style={{ background: "linear-gradient(to bottom, #ffffff, #fdfcf9)" }}
      >
        {profile.occupation ? (
          <span className="text-[11px] text-[#6B6570] truncate">{profile.occupation}</span>
        ) : profile.education ? (
          <span className="text-[11px] text-[#6B6570] truncate">{profile.education}</span>
        ) : (
          <span className="text-[11px] text-[#B0A8B8]">{profile.profile_code ?? "—"}</span>
        )}
        <Link
          to="/profiles/$code"
          params={{ code: profileTarget }}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-0.5 text-[11px] font-semibold text-[#24103F] hover:text-[#087333] transition-colors shrink-0 ml-2"
        >
          View
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
