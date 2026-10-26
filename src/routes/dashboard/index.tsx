import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Camera,
  Crown,
  Edit3,
  Heart,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ProtectedPhoto } from "@/components/profiles/protected-photo";
import { ProfileCard, type PublicProfileCardData } from "@/components/profiles/profile-card";
import { useAuth } from "@/hooks/use-auth";
import {
  useActiveMembership,
  useOwnMatrimonialProfile,
  useOwnPhotos,
  useOwnPreferences,
  useOwnPrivateDetails,
  useUnreadNotificationCount,
} from "@/hooks/use-member-data";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { profileCompletion } from "@/lib/profile-completion";
import { formatHeight, locationLine } from "@/lib/format";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { user, account, isAdmin, isModerator } = useAuth();
  const { lang } = useLanguage();
  const ownProfileQuery = useOwnMatrimonialProfile();
  const profile = ownProfileQuery.data;
  const privateDetailsQuery = useOwnPrivateDetails(profile?.id);
  const preferencesQuery = useOwnPreferences(profile?.id);
  const photosQuery = useOwnPhotos(profile?.id);
  const membershipQuery = useActiveMembership();
  const unreadCountQuery = useUnreadNotificationCount();
  const actions = useProfileActions();

  const completion = profileCompletion(
    profile ?? null,
    privateDetailsQuery.data ?? null,
    preferencesQuery.data ?? null,
    photosQuery.data?.length ?? 0,
  );

  const primaryPhoto = photosQuery.data?.find((photo) => photo.is_primary) ?? photosQuery.data?.[0];

  const recommendedQuery = useQuery({
    queryKey: ["dashboard-recommended", profile?.gender, profile?.id],
    enabled: Boolean(profile?.id),
    queryFn: async () => {
      const targetGender =
        profile?.gender === "groom" || profile?.gender === "male"
          ? "bride"
          : profile?.gender === "bride" || profile?.gender === "female"
            ? "groom"
            : undefined;
      let query = supabase
        .from("approved_matrimonial_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (targetGender) query = query.eq("gender", targetGender);
      if (profile?.id) query = query.neq("id", profile.id);

      const { data, error } = await query;
      if (error) throw error;
      return ((data ?? []) as PublicProfileCardData[]).slice(0, 4);
    },
  });

  const displayName =
    account?.full_name || profile?.display_name || user?.email?.split("@")[0] || "Member";
  const planName = membershipQuery.data?.membership_plans?.name;
  const missing = completion.missing.slice(0, 3);

  return (
    <div className="space-y-9">
      {(!profile || !profile.declaration_accepted) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded border border-[#D1A329] bg-[#FAF8F3] p-4 text-xs text-[#24103F]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-[#D1A329]" />
            <span>
              {lang === "te"
                ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్ ఇంకా పూర్తి కాలేదు. సంబంధాల అన్వేషణలో కనిపించడానికి ప్రొఫైల్‌ను పూర్తి చేయండి."
                : "Your matrimonial profile is incomplete. Complete your profile to appear in community discovery."}
            </span>
          </div>
          <Link to="/onboarding" className="sbm-button sbm-button--primary shrink-0 text-xs">
            {lang === "te" ? "ప్రొఫైల్ పూర్తి చేయండి" : "Complete Profile"}
          </Link>
        </div>
      )}

      <header className="flex flex-col justify-between gap-5 border-b border-[#ded5c8] pb-7 sm:flex-row sm:items-end">
        <div>
          <span className="sbm-kicker">
            {lang === "te" ? "సభ్యుల పని ప్రదేశం" : "Member workspace"}
          </span>
          <h1 className="sbm-heading mt-3">
            {lang === "te" ? `స్వాగతం, ${displayName}.` : `Welcome back, ${displayName}.`}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6B6570]">
            {profile?.profile_code ? (
              <span className="font-semibold tracking-[0.08em] text-[#6B6570]">
                {profile.profile_code}
              </span>
            ) : null}
            <span className="hidden h-3 w-px bg-[#d4cabd] sm:block" />
            <span>{planName ? `${planName} member` : "Free account"}</span>
            <span className="hidden h-3 w-px bg-[#d4cabd] sm:block" />
            <span>Contact details are private by default</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(isAdmin || isModerator) && (
            <Link
              to="/admin"
              className="sbm-button sbm-button--outline border-[#087333] text-[#087333]"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {lang === "te" ? "నిర్వాహక పోర్టల్" : "Admin Portal"}
            </Link>
          )}
          <Link to="/dashboard/profile" className="sbm-button sbm-button--outline">
            <Edit3 className="h-4 w-4" aria-hidden />
            {lang === "te" ? "ప్రొఫైల్ సవరించండి" : "Edit profile"}
          </Link>
          <Link to="/search" className="sbm-button sbm-button--primary">
            <Search className="h-4 w-4" aria-hidden />
            {lang === "te" ? "ప్రొఫైల్స్ చూడండి" : "Discover profiles"}
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border border-[#ded5c8] bg-white">
        <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D1A329]" aria-hidden />
              <h2 className="text-sm font-bold text-[#24103F]">
                {lang === "te" ? "ప్రొఫైల్ పూర్తితనం" : "Profile completeness"}
              </h2>
            </div>
            <div className="mt-5 flex items-end gap-4">
              <p className="font-serif text-5xl leading-none text-[#24103F]">
                {completion.percent}
                <span className="font-sans text-lg text-[#6B6570]">%</span>
              </p>
              <div className="mb-1 flex-1">
                <div className="h-1.5 w-full overflow-hidden bg-[#ece5da]">
                  <div
                    className="h-full bg-[#087333] transition-all duration-500"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-[12px] leading-6 text-[#6B6570]">
              {missing.length > 0
                ? `${lang === "te" ? "ఇంకా జోడించవచ్చు" : "You can still add"} ${missing.join(", ")}. ${lang === "te" ? "ఇవి కుటుంబాలకు మీ గురించి స్పష్టమైన చిత్రాన్ని ఇస్తాయి." : "These details help families understand the fuller picture."}`
                : lang === "te"
                  ? "మీ ప్రొఫైల్ కుటుంబాలకు అవసరమైన ప్రధాన వివరాలను కలిగి ఉంది."
                  : "Your profile has the main details families usually look for."}
            </p>
          </div>
          <div className="flex items-center border-t border-[#e5ddd1] bg-[#FAF8F3] px-6 py-5 sm:border-l sm:border-t-0 sm:px-7">
            <Link to="/dashboard/profile" className="sbm-link-arrow">
              {lang === "te" ? "వివరాలు పూర్తి చేయండి" : "Continue your profile"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 border-y border-[#ded5c8] sm:grid-cols-4">
        <Stat
          label={lang === "te" ? "షార్ట్‌లిస్ట్" : "Shortlisted"}
          value={actions.shortlistedIds.size}
          to="/dashboard/shortlist"
          icon={Heart}
        />
        <Stat
          label={lang === "te" ? "పంపిన ఆసక్తులు" : "Interests sent"}
          value={actions.sentInterests.size}
          to="/dashboard/interests"
          icon={Mail}
        />
        <Stat
          label={lang === "te" ? "నోటిఫికేషన్లు" : "Notifications"}
          value={unreadCountQuery.data ?? 0}
          to="/dashboard/notifications"
          icon={Bell}
        />
        <Stat
          label={lang === "te" ? "సభ్యత్వం" : "Membership"}
          value={planName ?? "Free"}
          to="/membership"
          icon={Crown}
          compact
        />
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <span className="sbm-kicker">{lang === "te" ? "మీ ప్రొఫైల్" : "Your profile"}</span>
              <h2 className="mt-2 font-serif text-2xl text-[#24103F]">
                {lang === "te" ? "కుటుంబాలు చూసేది" : "What families see"}
              </h2>
            </div>
            {profile?.id ? (
              <Link
                to="/profile/$id"
                params={{ id: profile.id }}
                className="sbm-link-arrow shrink-0 text-[11px]"
              >
                {lang === "te" ? "పబ్లిక్ వ్యూ" : "Public view"}
              </Link>
            ) : null}
          </div>

          {ownProfileQuery.isLoading ? (
            <div className="sbm-skeleton aspect-[4/5] w-full" />
          ) : profile ? (
            <div className="border border-[#ded5c8] bg-white">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9df]">
                <ProtectedPhoto
                  profileId={profile.id}
                  displayName={profile.display_name}
                  ownerMode={true}
                  storagePath={primaryPhoto?.storage_path}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b0a30]/85 to-transparent p-4 text-white">
                  <p className="font-serif text-2xl leading-tight">
                    {profile.display_name}
                    {profile.age ? (
                      <span className="font-sans text-sm font-medium text-white/75">
                        , {profile.age}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[11px] text-white/75">
                    {locationLine(profile.city, profile.state) || "Location not added"}
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-[#e5ddd1] px-4 text-[12px]">
                <div className="flex items-center justify-between py-3">
                  <dt className="text-[#6B6570]">Height</dt>
                  <dd className="font-semibold text-[#24103F]">
                    {profile.height_cm ? formatHeight(profile.height_cm) : "Not added"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="shrink-0 text-[#6B6570]">Education</dt>
                  <dd className="truncate text-right font-semibold text-[#24103F]">
                    {profile.education || "Not added"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="shrink-0 text-[#6B6570]">Occupation</dt>
                  <dd className="truncate text-right font-semibold text-[#24103F]">
                    {profile.occupation || "Not added"}
                  </dd>
                </div>
              </dl>
              <div className="flex items-start gap-2 border-t border-[#e5ddd1] bg-[#FAF8F3] px-4 py-3">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#087333]" aria-hidden />
                <p className="text-[11px] leading-5 text-[#6B6570]">
                  Contact details and private photos are not shown publicly. You control what is
                  shared.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[#cdbfa6] bg-white px-6 py-12 text-center">
              <UserRound className="mx-auto h-6 w-6 text-[#D1A329]" aria-hidden />
              <h3 className="mt-4 font-serif text-2xl text-[#24103F]">
                {lang === "te"
                  ? "ఈ ఖాతాకు మ్యాట్రిమోనీ ప్రొఫైల్ కనుగొనబడలేదు."
                  : "No profile found for this account."}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-[12px] leading-6 text-[#6B6570]">
                {lang === "te"
                  ? "అన్వేషణలో కనిపించడానికి మరియు ఆసక్తులు పొందడానికి మీ మ్యాట్రిమోనీ ప్రొఫైల్‌ను సృష్టించండి."
                  : "Create your matrimonial profile to appear in discovery and receive interests."}
              </p>
              <Link to="/onboarding" className="sbm-button sbm-button--primary mt-5">
                {lang === "te" ? "ప్రొఫైల్ సృష్టించండి" : "Create your profile"}
              </Link>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <span className="sbm-kicker">{lang === "te" ? "తర్వాత" : "Next"}</span>
            <h2 className="mt-2 font-serif text-2xl text-[#24103F]">
              {lang === "te" ? "ఈ వారం చేయవలసినవి" : "A few things worth doing"}
            </h2>
          </div>
          <div className="divide-y divide-[#ded5c8] border-y border-[#ded5c8]">
            <NextStep
              index="01"
              title={lang === "te" ? "ఒక స్పష్టమైన ఫోటో జోడించండి" : "Add a clear portrait"}
              text={
                photosQuery.data?.length
                  ? `${photosQuery.data.length} photo${photosQuery.data.length === 1 ? "" : "s"} uploaded. Keep at least one recent, clear portrait.`
                  : "Families look for a recent, clear portrait. You can keep additional photos private."
              }
              to="/dashboard/photos"
              cta={lang === "te" ? "ఫోటోలు" : "Manage photos"}
              icon={Camera}
            />
            <NextStep
              index="02"
              title={lang === "te" ? "కుటుంబ వివరాలు పూర్తి చేయండి" : "Complete the family picture"}
              text={
                privateDetailsQuery.data
                  ? "Review the family, lifestyle and horoscope details you have shared."
                  : "Add the family background, lifestyle and horoscope details families usually ask about."
              }
              to="/dashboard/profile"
              cta={lang === "te" ? "వివరాలు" : "Add details"}
              icon={UserRound}
            />
            <NextStep
              index="03"
              title={lang === "te" ? "మీ గోప్యతను సరిచూసుకోండి" : "Check your privacy"}
              text="Decide who can see your photos and when contact details become available."
              to="/dashboard/privacy"
              cta={lang === "te" ? "గోప్యత" : "Privacy settings"}
              icon={ShieldCheck}
            />
            <NextStep
              index="04"
              title={lang === "te" ? "సభ్యత్వాన్ని పరిశీలించండి" : "Understand membership"}
              text={
                planName
                  ? `You are on ${planName}. Review the benefits included in your plan.`
                  : "Your free account is active. Compare plans only if their current benefits are useful."
              }
              to="/membership"
              cta={lang === "te" ? "ప్లాన్లు" : "View plans"}
              icon={Crown}
            />
          </div>
        </section>
      </div>

      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#ded5c8] pb-4 sm:flex-row sm:items-end">
          <div>
            <span className="sbm-kicker">
              {lang === "te" ? "సమాజం నుండి" : "From the community"}
            </span>
            <h2 className="mt-2 font-serif text-2xl text-[#24103F]">
              {lang === "te" ? "మీకు సరిపోయే ప్రొఫైల్స్" : "Profiles you may wish to look at"}
            </h2>
            <p className="mt-1 text-[12px] text-[#6B6570]">
              Based on the gender preference in your profile. Not a compatibility score.
            </p>
          </div>
          <Link to="/search" className="sbm-link-arrow shrink-0">
            {lang === "te" ? "అన్నీ చూడండి" : "See all profiles"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recommendedQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden border border-[#ded5c8] bg-white">
                <div className="sbm-skeleton aspect-[4/5] rounded-none" />
                <div className="space-y-2 p-4">
                  <div className="sbm-skeleton h-3 w-3/4" />
                  <div className="sbm-skeleton h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendedQuery.data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {recommendedQuery.data.map((match) => (
              <ProfileCard
                key={match.id}
                profile={match}
                shortlisted={actions.shortlistedIds.has(match.id)}
                interestSent={actions.sentInterests.has(match.id)}
                onShortlist={() => actions.toggleShortlist.mutate(match.id)}
                onInterest={() => actions.sendInterest.mutate(match.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#cdbfa6] bg-white px-6 py-12 text-center">
            <p className="text-sm text-[#6B6570]">
              {lang === "te"
                ? "ప్రస్తుతం కొత్త ప్రొఫైల్స్ లేవు. తర్వాత మళ్లీ చూడండి."
                : "No new profiles are available right now. Check back as more members complete review."}
            </p>
            <Link to="/search" className="sbm-button sbm-button--outline mt-4">
              {lang === "te" ? "అన్వేషణకు వెళ్లండి" : "Open discovery"}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  to,
  icon: Icon,
  compact = false,
}: {
  label: string;
  value: number | string;
  to: string;
  icon: typeof Heart;
  compact?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-2 border-b border-[#ded5c8] px-4 py-5 transition-colors hover:bg-white sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B6570]">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-[#a98a37]" aria-hidden />
      </div>
      <span
        className={
          compact
            ? "truncate font-serif text-xl text-[#24103F]"
            : "font-serif text-3xl leading-none text-[#24103F]"
        }
      >
        {value}
      </span>
    </Link>
  );
}

function NextStep({
  index,
  title,
  text,
  to,
  cta,
  icon: Icon,
}: {
  index: string;
  title: string;
  text: string;
  to: string;
  cta: string;
  icon: typeof Heart;
}) {
  return (
    <div className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-4 sm:grid-cols-[2.5rem_1fr_auto] sm:gap-4">
      <span className="font-serif text-lg text-[#D1A329]">{index}</span>
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-[#6B6570]" aria-hidden />
          <h3 className="text-[13px] font-semibold text-[#24103F]">{title}</h3>
        </div>
        <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">{text}</p>
      </div>
      <Link to={to} className="sbm-link-arrow mt-0.5 text-[11px]">
        {cta}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
