import { createFileRoute } from "@tanstack/react-router";
import { useState, ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Trash2, CheckCircle2, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { useAuth } from "@/hooks/use-auth";
import { useOwnMatrimonialProfile, useOwnPhotos } from "@/hooks/use-member-data";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET } from "@/lib/site";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/dashboard/photos")({
  component: DashboardPhotosPage,
});

function DashboardPhotosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const photosQuery = useOwnPhotos(profile?.id);

  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user || !profile?.id) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG or PNG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const isFirst = (photosQuery.data?.length ?? 0) === 0;

      const { error: dbError } = await supabase.from("profile_photos").insert({
        owner_id: user.id,
        profile_id: profile.id,
        storage_path: filePath,
        is_primary: isFirst,
      });

      if (dbError) throw dbError;

      toast.success("Photo uploaded successfully!");
      void queryClient.invalidateQueries({ queryKey: ["own-photos"] });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload photo."));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function setAsPrimary(photoId: string) {
    if (!profile?.id) return;
    try {
      await supabase
        .from("profile_photos")
        .update({ is_primary: false })
        .eq("profile_id", profile.id);

      const { error } = await supabase
        .from("profile_photos")
        .update({ is_primary: true })
        .eq("id", photoId);

      if (error) throw error;
      toast.success("Primary photo updated.");
      void queryClient.invalidateQueries({ queryKey: ["own-photos"] });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not set primary photo."));
    }
  }

  async function deletePhoto(photoId: string, storagePath: string) {
    try {
      await supabase.from("profile_photos").delete().eq("id", photoId);
      await supabase.storage.from(PHOTO_BUCKET).remove([storagePath]);

      toast.success("Photo removed.");
      void queryClient.invalidateQueries({ queryKey: ["own-photos"] });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not remove photo."));
    }
  }

  if (ownProfileQuery.isLoading || photosQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="Profile Required"
        description="Please create your basic matrimonial profile first before adding photos."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Manage Photos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload up to 5 clear photos. Photos are protected according to your privacy settings.
          </p>
        </div>

        <div>
          <input
            type="file"
            id="photo-upload-input"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="photo-upload-input" className="cursor-pointer">
              <Upload className="mr-1.5 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload New Photo"}
            </label>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-muted/40 p-4 text-xs text-muted-foreground flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-primary shrink-0" />
        <span>
          Recommended: Clear front-facing portraits in formal or traditional attire. Group photos or
          watermarked images are not advised.
        </span>
      </div>

      {!photosQuery.data?.length ? (
        <EmptyState
          title="No photos uploaded yet"
          description="Adding a photo increases match requests significantly."
        >
          <div className="mt-4">
            <Button asChild>
              <label htmlFor="photo-upload-input" className="cursor-pointer">
                <Camera className="mr-1.5 h-4 w-4" />
                Upload Your First Photo
              </label>
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {photosQuery.data.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-[3/4] w-full bg-muted">
                <ProtectedPhoto
                  profileId={profile.id}
                  displayName={profile.display_name}
                  ownerMode={true}
                  storagePath={photo.storage_path}
                  className="h-full w-full"
                />
                {photo.is_primary ? (
                  <span className="absolute top-2 left-2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow">
                    Primary Photo
                  </span>
                ) : null}
              </div>
              <CardContent className="p-3 flex items-center justify-between gap-2 border-t">
                {!photo.is_primary ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setAsPrimary(photo.id)}
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-primary" />
                    Set Primary
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">Main Photo</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => deletePhoto(photo.id, photo.storage_path)}
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
