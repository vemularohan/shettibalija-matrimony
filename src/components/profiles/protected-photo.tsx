import { useEffect, useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthorizedPhotos } from "@/functions/photos";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET, SITE_NAME_TE } from "@/lib/site";
import { initials } from "@/lib/format";
import { isDemoId } from "@/data/demo-profiles";
import { ShettibalijaLogo } from "@/components/brand/logo";

type Props = {
  profileId: string;
  displayName: string;
  ownerMode?: boolean | undefined;
  storagePath?: string | null | undefined;
  photoUrl?: string | null | undefined;
  className?: string | undefined;
  compact?: boolean | undefined;
};

export function ProtectedPhoto({
  profileId,
  displayName,
  ownerMode = false,
  storagePath,
  photoUrl,
  className,
  compact = false,
}: Props) {
  const [url, setUrl] = useState<string | null>(photoUrl ?? null);
  const [imgError, setImgError] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(Boolean(storagePath || photoUrl));

  useEffect(() => {
    let cancelled = false;
    setImgError(false);

    // If explicit static preview photoUrl is given (e.g. demo profile)
    if (photoUrl) {
      setUrl(photoUrl);
      setLocked(false);
      setHasPhotos(true);
      return;
    }

    // Demo profiles without static photoUrl skip network query
    if (isDemoId(profileId)) {
      setUrl(null);
      setLocked(false);
      setHasPhotos(false);
      return;
    }

    async function load() {
      if (ownerMode && storagePath) {
        try {
          const { data } = await supabase.storage
            .from(PHOTO_BUCKET)
            .createSignedUrl(storagePath, 120);
          if (!cancelled) {
            setUrl(data?.signedUrl ?? null);
            setLocked(false);
            setHasPhotos(Boolean(data?.signedUrl));
          }
        } catch {
          if (!cancelled) {
            setUrl(null);
            setHasPhotos(false);
          }
        }
        return;
      }

      try {
        const result = await getAuthorizedPhotos({ data: { profileId } });
        if (cancelled) return;

        const photoExists = Boolean(result.hasPhotos);
        setHasPhotos(photoExists);

        if (result.allowed && result.photos[0]?.url) {
          setUrl(result.photos[0].url);
          setLocked(false);
        } else if (photoExists) {
          setUrl(null);
          setLocked(true);
        } else {
          setUrl(null);
          setLocked(false);
        }
      } catch {
        if (!cancelled) {
          setUrl(null);
          setLocked(false);
          setHasPhotos(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [profileId, ownerMode, storagePath, photoUrl]);

  const showPhoto = Boolean(url && !imgError);

  return (
    <div className={cn("relative overflow-hidden bg-[#21083F]", className)}>
      {showPhoto ? (
        <img
          src={url!}
          alt={`${displayName} profile photo`}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        /* Shettibalija Official Branded Avatar */
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#21083F] via-[#2f0c54] to-[#140424] p-4 text-center select-none overflow-hidden">
          {/* Subtle Logo Watermark in background */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="h-36 w-36 object-contain filter grayscale"
            />
          </div>

          {/* Central Monogram Ring */}
          <div
            className={cn(
              "relative z-10 flex items-center justify-center rounded-full border border-[#D9A514]/40 bg-black/30 shadow-[0_0_20px_rgba(217,165,20,0.25)] backdrop-blur-xs transition group-hover:scale-105",
              compact ? "h-14 w-14" : "h-20 w-20",
            )}
          >
            <ShettibalijaLogo size={compact ? "xs" : "sm"} priority theme="dark" />
          </div>

          <span
            className={cn(
              "relative z-10 mt-2 font-serif font-bold tracking-wider text-white drop-shadow-sm",
              compact ? "text-base" : "text-xl",
            )}
          >
            {initials(displayName)}
          </span>

          <div className="relative z-10 mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#D9A514]/15 border border-[#D9A514]/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#F4D477]">
            <Sparkles className="h-3 w-3 text-[#D9A514]" />
            <span>{SITE_NAME_TE}</span>
          </div>
        </div>
      )}

      {/* Locked overlay for privacy if photo exists but user is unauthorized */}
      {hasPhotos && locked && !ownerMode ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#21083F]/85 px-4 text-center text-white backdrop-blur-md">
          <div className="rounded-full bg-black/40 p-2.5 border border-[#D9A514]/40 shadow-lg">
            <Lock className="h-5 w-5 text-[#F4D477]" aria-hidden />
          </div>
          <p className="mt-2 text-sm font-bold text-white tracking-wide">Photo Protected</p>
          {!compact ? (
            <>
              <p className="mt-1 text-xs text-white/80 max-w-[15rem] leading-relaxed">
                Connect or upgrade membership to view this candidate's verified photo.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-3 rounded-full bg-gradient-to-r from-[#034B21] to-[#087A32] text-xs font-bold text-white border border-[#D9A514]/40 hover:shadow-md"
              >
                <Link to="/membership">View Membership</Link>
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
