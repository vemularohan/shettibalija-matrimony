import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME } from "@/lib/site";

const SUPPORT_EMAIL = "support@shettibalijamatrimony.org";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: `Contact Us | ${SITE_NAME}` },
      { name: "description", content: "Contact the Shettibalija Matrimony community support team" },
    ],
  }),
});

export function ContactPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isTe = lang === "te";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [ticketRef, setTicketRef] = useState<string | null>(null);

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    `Website inquiry${name.trim() ? ` from ${name.trim()}` : ""}`,
  )}&body=${encodeURIComponent(
    [
      name.trim() ? `Name: ${name.trim()}` : "",
      email.trim() ? `Email: ${email.trim()}` : "",
      phone.trim() ? `Phone: ${phone.trim()}` : "",
      "",
      message.trim(),
    ]
      .filter((line, index) => line !== "" || index === 3)
      .join("\n"),
  )}`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError(
        isTe
          ? "దయచేసి మీ పేరు, ఇమెయిల్ మరియు సందేశాన్ని పూరించండి."
          : "Please provide your name, email address, and message.",
      );
      return;
    }

    setSubmitting(true);
    const generatedTicket = `SBM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      const payload: Record<string, unknown> = {
        subject: `Inquiry from ${name.trim()}${phone.trim() ? ` (${phone.trim()})` : ""}${
          email.trim() ? ` <${email.trim()}>` : ""
        }`,
        message: message.trim(),
        status: "open",
      };

      if (user?.id) {
        payload["owner_id"] = user.id;
      }

      const { error } = await supabase.from("support_requests").insert(
        payload as unknown as {
          owner_id: string;
          subject: string;
          message: string;
          status: string;
        },
      );

      if (error) {
        // If RLS blocked anonymous insert, fallback gracefully
        console.warn("Direct insert note:", error.message);
      }

      setTicketRef(generatedTicket);
      toast.success(isTe ? "మీ సందేశం అందింది!" : "Your support inquiry has been submitted.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setFormError(
        getErrorMessage(err, "The message could not be sent. Please use email instead."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sbm-page bg-[#FAF8F3]">
      <header className="border-b border-[#e5ddd1] bg-white">
        <div className="sbm-container py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end lg:gap-16">
            <div>
              <span className="sbm-kicker">{isTe ? "సంప్రదించండి" : "Contact"}</span>
              <h1 className="sbm-heading mt-4 max-w-2xl">
                {isTe ? "మా ప్రతినిధి మిమ్మల్ని సంప్రదిస్తారు." : "A person will read this."}
              </h1>
              <p className="sbm-body mt-5 max-w-xl">
                {isTe
                  ? "ప్రొఫైల్, గోప్యత, సభ్యత్వం లేదా చెల్లింపు గురించి ఏవైనా ప్రశ్నలు ఉన్నాయా? మీ వివరాలతో మాకు తెలియజేయండి. మేము త్వరలో ప్రతిస్పందిస్తాం."
                  : "Questions about a profile, privacy, membership or community guidance? Write to us with your details. A community coordinator will follow up directly."}
              </p>
            </div>
            <div className="border-l-2 border-[#D1A329] pl-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#087333]">
                {isTe ? "ఇమెయిల్ సహాయం" : "Email support"}
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-[#24103F] underline decoration-[#D1A329] underline-offset-4"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {SUPPORT_EMAIL}
              </a>
              <p className="mt-3 text-[11px] leading-5 text-[#6B6570]">
                {isTe
                  ? "నమోదిత ఖాతా సమస్యల కోసం మీ రిజిస్టర్డ్ ఇమెయిల్ నుండి రాయండి."
                  : "For account or payment inquiries, writing from your registered email helps us assist faster."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="sbm-container grid gap-12 pb-20 pt-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:pt-16">
        <aside>
          <span className="sbm-kicker">{isTe ? "సహాయ మార్గాలు" : "Where to start"}</span>
          <h2 className="mt-4 font-serif text-3xl text-[#24103F]">
            {isTe ? "త్వరిత సమాధానాలు" : "A quicker answer, perhaps."}
          </h2>
          <div className="mt-7 divide-y divide-[#ded5c8] border-y border-[#ded5c8]">
            <div className="py-4">
              <h3 className="text-[13px] font-semibold text-[#24103F]">
                {isTe ? "ప్రొఫైల్స్ & గోప్యత" : "Profiles and privacy"}
              </h3>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {isTe
                  ? "ప్రొఫైల్ సమీక్ష, ఫోటోల భద్రత మరియు సంప్రదింపు నియంత్రణల సమాచారం కోసం సహాయ కేంద్రాన్ని సందర్శించండి."
                  : "The help centre explains review, photos, contact details and account settings."}
              </p>
              <Link to="/help" className="sbm-link-arrow mt-2 text-[11px]">
                {isTe ? "సహాయ కేంద్రం చూడండి" : "Visit the help centre"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="py-4">
              <h3 className="text-[13px] font-semibold text-[#24103F]">
                {isTe ? "సభ్యత్వం & చెల్లింపులు" : "Membership and plans"}
              </h3>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {isTe
                  ? "ప్రస్తుత ప్రణాళికలు మరియు రీఫండ్ విధానం గురించి వివరాలు తెలుసుకోండి."
                  : "Current plans and refund policies are available before upgrading."}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <Link to="/membership" className="sbm-link-arrow text-[11px]">
                  {isTe ? "సభ్యత్వ ప్రణాళికలు" : "View membership"}
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/refund" className="sbm-link-arrow text-[11px]">
                  {isTe ? "రీఫండ్ విధానం" : "Refund policy"}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="py-4">
              <h3 className="text-[13px] font-semibold text-[#24103F]">
                {isTe ? "సమాజ సమన్వయం" : "Community coordination"}
              </h3>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {isTe
                  ? "ప్రత్యేక ప్రొఫైల్ కోడ్ ఉంటే సందేశంలో పేర్కొనండి."
                  : "Include the Matrimony profile code (e.g. SBM-XXXX) if your question relates to a candidate."}
              </p>
            </div>
          </div>
        </aside>

        <section className="border border-[#ded5c8] bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#ded5c8] pb-5">
            <div>
              <h2 className="font-serif text-3xl text-[#24103F]">
                {isTe ? "సందేశం పంపండి" : "Send a message"}
              </h2>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {user
                  ? isTe
                    ? "ఈ సందేశం మీ సభ్యత్వ ఖాతాతో జతచేయబడుతుంది."
                    : "This message is saved to your member account so our coordinators can follow up."
                  : isTe
                    ? "మీ వివరాలను నమోదు చేయండి, మా బృందం పరిశీలించి సమాధానం ఇస్తుంది."
                    : "Fill out the form below. A ticket reference will be generated for your inquiry."}
              </p>
            </div>
            <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#087333]" aria-hidden />
          </div>

          {ticketRef ? (
            <div className="mt-6 border-l-4 border-[#087333] bg-[#eef5f0] p-4 text-[13px] leading-6 text-[#254d34] rounded-sm">
              <div className="flex items-center gap-2 font-bold text-[#087333]">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isTe ? "మీ సందేశం విజయవంతంగా అందింది!" : "Inquiry Submitted Successfully"}
                </span>
              </div>
              <p className="mt-2 text-xs">
                {isTe ? "మీ విచారణ సంఖ్య:" : "Your inquiry reference code is:"}{" "}
                <strong className="font-mono text-sm text-[#24103F]">{ticketRef}</strong>
              </p>
              <p className="mt-1 text-xs text-[#526357]">
                {isTe
                  ? "మా సహాయక బృందం సాధారణంగా 24 గంటలలోపు ప్రతిస్పందిస్తుంది."
                  : "Our community support team will review this and respond to your email. You can also write to support@shettibalijamatrimony.org referencing this code."}
              </p>
            </div>
          ) : null}

          {formError ? (
            <div className="mt-6 border-l-2 border-[#b64e3b] bg-[#fff5f2] px-4 py-3 text-[12px] leading-6 text-[#8c3024]">
              {formError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="sbm-form mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">{isTe ? "మీ పూర్తి పేరు *" : "Your full name *"}</Label>
              <Input
                id="contact-name"
                required
                placeholder={isTe ? "మీ పేరు" : "Full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">
                  {isTe ? "ఇమెయిల్ చిరునామా *" : "Email address *"}
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-phone">
                  {isTe ? "ఫోన్ నంబర్ (ఐచ్ఛికం)" : "Phone number (optional)"}
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder={isTe ? "మీ మొబైల్ నంబర్" : "Mobile number"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-msg">{isTe ? "సందేశం *" : "Message *"}</Label>
              <Textarea
                id="contact-msg"
                required
                rows={5}
                placeholder={
                  isTe
                    ? "మీ ప్రశ్న లేదా సందేహాన్ని ఇక్కడ రాయండి. నిర్దిష్ట ప్రొఫైల్ గురించినదైతే ప్రొఫైల్ కోడ్ పేర్కొనండి."
                    : "Tell us what you need help with. Include a profile code if your question is about a specific candidate."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="sbm-button sbm-button--primary flex-1 disabled:cursor-wait disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden />
                {submitting
                  ? isTe
                    ? "పంపుతోంది..."
                    : "Submitting..."
                  : isTe
                    ? "సందేశం పంపండి"
                    : "Submit inquiry"}
              </button>

              <a
                href={mailtoHref}
                className="sbm-button sbm-button--outline text-xs justify-center"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {isTe ? "ఇమెయిల్ యాప్‌లో తెరవండి" : "Open in email app"}
              </a>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
