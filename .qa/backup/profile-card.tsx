import { ArrowRight, Heart, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
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
  has_profile_photo?: boolean | null | undefined;
  mother_tongue?: string | null | undefined;
  community?: string | null | undefined;
  community_profession?: string | null | undefined;
  food_habit?: string | null | undefined;
  last_active_at?: string | null | undefined;
  verified_at?: string | null | undefined;
  citizenship?: string | null | undefined;
  present_location?: string | null | undefined;
  designation?: string | null | undefined;
  job_location?: string | null | undefined;
  created_at?: string | null | undefined;
};

export function ProfileCard({
  profile,
  shortlisted = false,
  interestSent = false,
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
  const name = profile.display_name ?? "Community Member";
  const profileTarget = profile.profile_code ?? profile.id;
  const location = locationLine(profile.city, profile.state);
  const facts = [profile.education, profile.occupation].filter(Boolean);

  return (
    <article className={cn("profile-card-editorial group", className)}>
      <div className="relative overflow-hidden bg-[#EDE5D6]">
        <Link
          to="/profiles/$code"
          params={{ code: profileTarget }}
          aria-label={`View ${name}'s profile`}
          className="block"
        >
          <ProtectedPhoto
            profileId={profile.id}
            displayName={name}
            photoUrl={profile.photo_url}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            compact
          />
        </Link>
        <button
          type="button"
          onClick={onShortlist}
          aria-pressed={shortlisted}
          aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          className={cn(
            "absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DDD3] bg-white text-[#756A61] transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24103F]",
            shortlisted && "text-rose-600",
          )}
        >
          <Heart className={cn("h-4 w-4", shortlisted && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="min-w-0 truncate font-serif text-xl font-medium leading-tight text-[#24103F]">
            {name}
          </h3>
          <span className="shrink-0 text-sm font-medium text-[#756A61]">
            {profile.age ? `${profile.age}` : "—"}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#756A61]">
          {profile.age ? `${profile.age} years` : "Age not shared"}
          {profile.height_cm ? ` · ${formatHeight(profile.height_cm)}` : ""}
        </p>

        <div className="mt-3 space-y-1.5 border-t border-[#E4DDD3] pt-3 text-xs text-[#756A61]">
          {facts.map((fact, index) => (
            <p key={`${fact}-${index}`} className="truncate">
              {fact}
            </p>
          ))}
          <p className="flex min-w-0 items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#087333]" />
            {location || "Location not shared"}
          </p>
          <p className="font-medium tracking-wide text-[#817985]">
            ID {profile.profile_code ?? "Pending"}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link to="/profiles/$code" params={{ code: profileTarget }}>
              View Profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 px-3"
            disabled={interestSent}
            onClick={onInterest}
          >
            {interestSent ? "Sent" : "Interest"}
          </Button>
        </div>
      </div>
    </article>
  );
}
