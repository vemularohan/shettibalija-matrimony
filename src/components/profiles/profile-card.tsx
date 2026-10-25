import { ArrowRight, Check, Heart, MapPin, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { formatHeight, locationLine } from "@/lib/format";
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
  interestSent,
  onShortlist,
  onInterest,
  className,
}: {
  profile: PublicProfileCardData;
  shortlisted?: boolean;
  interestSent?: boolean;
  onShortlist?: () => void;
  onInterest?: () => void;
  className?: string;
}) {
  const name = profile.display_name ?? "Community member";
  const profileTarget = profile.profile_code ?? profile.id;
  const location = locationLine(profile.city, profile.state);
  const height = profile.height_cm ? formatHeight(profile.height_cm) : null;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#ded5c8] bg-white",
        "transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#cdbb95] hover:shadow-[0_14px_35px_rgba(36,16,63,0.08)]",
        className,
      )}
    >
      <Link
        to="/profiles/$code"
        params={{ code: profileTarget }}
        className="relative block aspect-[4/5] overflow-hidden bg-[#efe9df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D1A329]"
      >
        <ProtectedPhoto
          profileId={profile.id}
          displayName={name}
          photoUrl={profile.photo_url}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          compact
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b0a30]/80 via-[#1b0a30]/8 to-transparent" />
        <span
          aria-hidden
          className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#D1A329]/70"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="font-serif text-xl leading-tight tracking-[-0.01em]">
            {name}
            {profile.age ? (
              <span className="font-sans text-[13px] font-medium text-white/75">
                , {profile.age}
              </span>
            ) : null}
          </p>
          {location ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-white/75">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{location}</span>
            </p>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[2.5rem] space-y-1 text-[12px] leading-5 text-[#5f5765]">
          {profile.education ? <p className="truncate">{profile.education}</p> : null}
          {profile.occupation ? (
            <p className="truncate text-[#24103F]">{profile.occupation}</p>
          ) : null}
          {!profile.education && !profile.occupation ? (
            <p className="text-[#9a929e]">Profile details are being completed.</p>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6B6570]">
          {height ? <span>{height}</span> : null}
          {profile.star ? <span>{profile.star}</span> : null}
          {profile.gothram ? <span>{profile.gothram}</span> : null}
          {profile.profile_code ? (
            <span className="ml-auto font-medium tracking-wide">{profile.profile_code}</span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-4">
          <button
            type="button"
            onClick={onShortlist}
            aria-pressed={Boolean(shortlisted)}
            aria-label={shortlisted ? `Remove ${name} from shortlist` : `Shortlist ${name}`}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border transition-colors",
              shortlisted
                ? "border-[#087333]/30 bg-[#087333]/8 text-[#087333]"
                : "border-[#ded5c8] text-[#6B6570] hover:border-[#24103F] hover:text-[#24103F]",
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", shortlisted && "fill-current")} aria-hidden />
          </button>

          <button
            type="button"
            onClick={onInterest}
            className={cn(
              "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-sm border px-2 text-[11px] font-bold transition-colors",
              interestSent
                ? "border-[#087333]/30 bg-[#087333]/8 text-[#087333]"
                : "border-[#24103F] bg-[#24103F] text-white hover:bg-[#35165a]",
            )}
          >
            {interestSent ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                Interest sent
              </>
            ) : (
              <>
                <Send className="h-3 w-3" aria-hidden />
                Interest
              </>
            )}
          </button>

          <Link
            to="/profiles/$code"
            params={{ code: profileTarget }}
            className="flex h-8 shrink-0 items-center justify-center rounded-sm border border-[#ded5c8] px-2 text-[#24103F] transition-colors hover:border-[#24103F]"
            aria-label={`View ${name}'s profile`}
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
