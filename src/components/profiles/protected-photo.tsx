import { useEffect, useState } from "react";
import { Lock, UserRound, CameraOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthorizedPhotos } from "@/functions/photos";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET } from "@/lib/site";
import { initials } from "@/lib/format";
import { isDemoId } from "@/data/demo-profiles";

type Props = {
  profileId: string;
  displayName: string;
  ownerMode?: boolean | undefined;
  storagePath?: string | null | undefined;
  className?: string | undefined;
  compact?: boolean | undefined;
};

export function ProtectedPhoto({
  profileId,
  displayName,
  ownerMode = false,
  storagePath,
  className,
  compact = false,
}: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(Boolean(storagePath));

  useEffect(() => {
    let cancelled = false;
    setImgError(false);

    // Demo profiles have no photos by design; skip network query
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
  }, [profileId, ownerMode, storagePath]);

  const showPhoto = Boolean(url && !imgError);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {showPhoto ? (
        <img
          src={url!}
          alt={`${displayName} profile photo`}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#f9f6f1] via-[#f1ebe0] to-[#e6dccb] p-4 text-center select-none">
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-white/70 shadow-xs border border-primary/10 text-primary/70 transition",
              compact ? "h-16 w-16" : "h-24 w-24",
            )}
          >
            <UserRound
              className={cn(compact ? "h-8 w-8" : "h-12 w-12", "stroke-[1.6]")}
              aria-hidden
            />
          </div>
          <span className="mt-2.5 font-serif text-lg font-semibold tracking-wide text-primary">
            {initials(displayName)}
          </span>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground border border-black/5">
            <CameraOff className="h-3 w-3 text-muted-foreground/70" aria-hidden />
            <span>Photo not added</span>
          </div>
        </div>
      )}

      {/* Only display locked overlay if an actual photo exists and is restricted */}
      {hasPhotos && locked && !ownerMode ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#3b1218]/60 px-3 text-center text-white backdrop-blur-[1px]">
          <Lock className="h-6 w-6" aria-hidden />
          <p className="mt-2 text-sm font-semibold">Photo Protected</p>
          {!compact ? (
            <>
              <p className="mt-1 max-w-[16rem] text-xs text-white/85">
                Upgrade membership or request access to view this candidate's photo.
              </p>
              <Button asChild size="sm" className="mt-3 bg-gold text-primary hover:bg-gold/90">
                <Link to="/membership">View Options</Link>
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
