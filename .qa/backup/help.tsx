import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({ meta: [{ title: `Help & FAQs | ${SITE_NAME}` }] }),
});

const FAQ_ITEMS = [
  {
    q: "How do I register on Shettibalija Matrimony?",
    qTe: "శెట్టిబలిజ మ్యాట్రిమోనీలో ఎలా రిజిస్టర్ అవ్వాలి?",
    a: "Registration is free. Select who the profile is for, create an account, and complete the candidate's personal, education, occupation and family details. New profiles are reviewed before appearing in search.",
    aTe: "రిజిస్ట్రేషన్ ఉచితం. ప్రొఫైల్ ఎవరి కోసమో ఎంచుకుని ఖాతా సృష్టించి, అభ్యర్థి వ్యక్తిగత, విద్య, ఉద్యోగ మరియు కుటుంబ వివరాలను నమోదు చేయండి. శోధనలో కనిపించే ముందు కొత్త ప్రొఫైల్ సమీక్షించబడుతుంది.",
  },
  {
    q: "How are my phone number and private details protected?",
    qTe: "నా ఫోన్ నంబర్ మరియు వ్యక్తిగత వివరాలు ఎలా రక్షించబడతాయి?",
    a: "Your account phone and private records are not shown on public profile pages. Contact access depends on the profile owner's privacy setting, an accepted contact request and an active eligible membership.",
    aTe: "మీ ఖాతా ఫోన్ మరియు వ్యక్తిగత రికార్డులు పబ్లిక్ ప్రొఫైల్‌లో చూపబడవు. సంప్రదింపు వివరాల ప్రాప్యత ప్రొఫైల్ యజమాని గోప్యతా సెట్టింగ్, ఆమోదించిన అభ్యర్థన మరియు చెల్లుబాటు అయ్యే సభ్యత్వంపై ఆధారపడి ఉంటుంది.",
  },
  {
    q: "Can a parent or relative create a candidate profile?",
    qTe: "తల్లిదండ్రులు లేదా బంధువులు అభ్యర్థి ప్రొఫైల్ సృష్టించవచ్చా?",
    a: "Yes. During profile creation, select the relationship that best describes who the profile is for. The account holder can manage the candidate's profile and requests.",
    aTe: "అవును. ప్రొఫైల్ సృష్టించేటప్పుడు అభ్యర్థితో మీ సంబంధాన్ని ఎంచుకోండి. ఖాతాదారు అభ్యర్థి ప్రొఫైల్ మరియు అభ్యర్థనలను నిర్వహించవచ్చు.",
  },
  {
    q: "How does profile review work?",
    qTe: "ప్రొఫైల్ సమీక్ష ఎలా జరుగుతుంది?",
    a: "Submitted profiles are checked by authorized staff. Once approved, a profile can appear in discovery while it is visible. Material profile edits return it to review before the changes are published.",
    aTe: "సమర్పించిన ప్రొఫైల్‌లను అధీకృత సిబ్బంది పరిశీలిస్తారు. ఆమోదం తర్వాత, కనిపించే స్థితిలో ఉన్న ప్రొఫైల్ శోధనలో కనిపిస్తుంది. ముఖ్యమైన మార్పులు ప్రచురణకు ముందు మళ్లీ సమీక్షకు వెళ్తాయి.",
  },
  {
    q: "How do I manage interests, shortlist and profile visibility?",
    qTe: "ఆసక్తులు, షార్ట్‌లిస్ట్ మరియు ప్రొఫైల్ కనిపించే స్థితిని ఎలా నిర్వహించాలి?",
    a: "Use My Matches and Search to discover profiles, then save, ignore, block or express interest. You can respond to received interests and change visibility, photo and profile-view settings in your member dashboard.",
    aTe: "ప్రొఫైల్‌లను కనుగొనడానికి నా మ్యాచ్‌లు మరియు శోధనను ఉపయోగించండి. తర్వాత సేవ్ చేయండి, పట్టించుకోనివిగా గుర్తించండి, బ్లాక్ చేయండి లేదా ఆసక్తి తెలియజేయండి. వచ్చిన ఆసక్తులకు స్పందించవచ్చు; డాష్‌బోర్డ్‌లో కనిపించే స్థితి, ఫోటో మరియు ప్రొఫైల్ వీక్షణ సెట్టింగ్‌లను మార్చవచ్చు.",
  },
];

function HelpPage() {
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <main className="min-h-[70vh] bg-[#F7F3EA] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-9 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#087333]">
            {lang === "te" ? "సహాయం & మద్దతు" : "Help & Support"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#24103F]">
            {lang === "te" ? "తరచూ అడిగే ప్రశ్నలు" : "Frequently asked questions"}
          </h1>
          <p className="mt-3 text-sm text-[#756A61]">
            {lang === "te"
              ? "ఖాతా, ప్రొఫైల్ గోప్యత మరియు కనెక్షన్‌ల గురించి సమాధానాలు."
              : "Answers about accounts, profile privacy and member connections."}
          </p>
        </header>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <section
                key={item.q}
                className="overflow-hidden rounded-xl border border-[#E4DDD3] bg-white"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-[#24103F] hover:bg-[#F7F3EA]"
                >
                  {lang === "te" ? item.qTe : item.q}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen ? (
                  <p className="border-t border-[#E4DDD3] px-4 pb-4 pt-3 text-sm leading-relaxed text-[#756A61]">
                    {lang === "te" ? item.aTe : item.a}
                  </p>
                ) : null}
              </section>
            );
          })}
        </div>
        <div className="mt-8 rounded-2xl border border-[#E4DDD3] bg-white p-5 text-center">
          <MessageCircle className="mx-auto h-5 w-5 text-[#087333]" />
          <p className="mt-2 font-semibold text-[#24103F]">
            {lang === "te" ? "ఇంకా సహాయం కావాలా?" : "Still need help?"}
          </p>
          <p className="mt-1 text-sm text-[#756A61]">
            {lang === "te"
              ? "మా సహాయ బృందానికి సందేశం పంపండి."
              : "Send a message to our support team."}
          </p>
          <Button asChild className="mt-4 bg-[#24103F] text-white hover:bg-[#311552]">
            <Link to="/contact">{lang === "te" ? "సంప్రదించండి" : "Contact Support"}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
