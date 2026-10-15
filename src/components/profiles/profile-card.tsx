import { Heart } from "lucide-react";
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
  is_demo?: boolean;
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
  const name = profile.display_name ?? "Member";
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md",
        className,
      )}
    >
      <ProtectedPhoto
        profileId={profile.id}
        displayName={name}
        className="aspect-[4/5] w-full"
        compact
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-primary">{profile.profile_code}</p>
          {profile.is_demo ? (
            <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200/80">
              Demo
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 font-serif text-xl text-foreground">
          {name}, {profile.age ?? "—"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.age ?? "—"} yrs • {formatHeight(profile.height_cm)}
        </p>
        <p className="mt-2 text-sm">
          {[profile.education, profile.occupation].filter(Boolean).join(" • ") ||
            "Details on profile"}
        </p>
        <p className="text-sm text-muted-foreground">{locationLine(profile.city, profile.state)}</p>
        {profile.family_summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {profile.family_summary}
          </p>
        ) : null}
        <div className="mt-auto grid grid-cols-1 gap-2 pt-4">
          <Button asChild>
            <Link to="/profiles/$code" params={{ code: profile.profile_code ?? profile.id }}>
              View Profile
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={shortlisted ? "secondary" : "outline"}
              onClick={onShortlist}
              aria-label={shortlisted ? "Remove from shortlist" : "Shortlist this profile"}
            >
              <Heart className={cn("h-4 w-4", shortlisted && "fill-primary text-primary")} />
              Shortlist
            </Button>
            <Button type="button" variant="outline" onClick={onInterest} disabled={interestSent}>
              {interestSent ? "Interest Sent" : "Express Interest"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
