import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { ArrowRight, Mail, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
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

function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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

    if (!user?.id) {
      setFormError(
        "Please sign in to send this through your account, or use the email draft button below.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("support_requests").insert({
        owner_id: user.id,
        subject: `Inquiry from ${name.trim()}${phone.trim() ? ` (${phone.trim()})` : ""}${
          email.trim() ? ` <${email.trim()}>` : ""
        }`,
        message: message.trim(),
        status: "open",
      });

      if (error) throw error;

      toast.success("Your message has been sent.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSent(true);
    } catch (err) {
      setFormError(
        getErrorMessage(err, "The message could not be sent. Please email us instead."),
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
              <span className="sbm-kicker">Contact</span>
              <h1 className="sbm-heading mt-4 max-w-2xl">A person will read this.</h1>
              <p className="sbm-body mt-5 max-w-xl">
                Questions about a profile, privacy, membership or a payment? Write to us with the
                details you have. We will reply using the contact details you provide.
              </p>
            </div>
            <div className="border-l-2 border-[#D1A329] pl-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#087333]">
                Email support
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-[#24103F] underline decoration-[#D1A329] underline-offset-4"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {SUPPORT_EMAIL}
              </a>
              <p className="mt-3 text-[11px] leading-5 text-[#6B6570]">
                For account or payment issues, please write from your registered email address.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="sbm-container grid gap-12 pb-20 pt-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:pt-16">
        <aside>
          <span className="sbm-kicker">Where to start</span>
          <h2 className="mt-4 font-serif text-3xl text-[#24103F]">A quicker answer, perhaps.</h2>
          <div className="mt-7 divide-y divide-[#ded5c8] border-y border-[#ded5c8]">
            <div className="py-4">
              <h3 className="text-[13px] font-semibold text-[#24103F]">Profiles and privacy</h3>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                The help centre explains review, photos, contact details and account settings.
              </p>
              <Link to="/help" className="sbm-link-arrow mt-2 text-[11px]">
                Visit the help centre
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="py-4">
              <h3 className="text-[13px] font-semibold text-[#24103F]">Membership and payments</h3>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                Current plans and the refund policy are published before you pay.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <Link to="/membership" className="sbm-link-arrow text-[11px]">
                  View membership
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/refund" className="sbm-link-arrow text-[11px]">
                  Refund policy
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="py-4">
              <h3 className="text-[13px] font-semibold text-[#24103F]">A safety concern</h3>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                Include the profile code and what happened. Please do not send identity documents by
                email.
              </p>
            </div>
          </div>
        </aside>

        <section className="border border-[#ded5c8] bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-[#ded5c8] pb-5">
            <div>
              <h2 className="font-serif text-3xl text-[#24103F]">Send a message</h2>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6570]">
                {user
                  ? "This message is saved to your member account so our team can follow up."
                  : "You can compose a message here and send it through your own email app."}
              </p>
            </div>
            <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#087333]" aria-hidden />
          </div>

          {sent ? (
            <div className="mt-6 border-l-2 border-[#087333] bg-[#eef5f0] px-4 py-3 text-[12px] leading-6 text-[#254d34]">
              Thank you. Your message has been received. If you need to add something, you can write
              to {SUPPORT_EMAIL}.
            </div>
          ) : null}

          {formError ? (
            <div className="mt-6 border-l-2 border-[#b64e3b] bg-[#fff5f2] px-4 py-3 text-[12px] leading-6 text-[#8c3024]">
              {formError}
            </div>
          ) : null}

          {!user ? (
            <p className="mt-5 border-l-2 border-[#D1A329] pl-3 text-[11px] leading-5 text-[#6B6570]">
              You are not signed in. Use <span className="font-semibold">Open email draft</span>{" "}
              below, or{" "}
              <Link
                to="/login"
                search={{ returnTo: "/contact" }}
                className="font-semibold text-[#087333] underline"
              >
                sign in
              </Link>{" "}
              to send through your account.
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="sbm-form mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">Your full name *</Label>
              <Input
                id="contact-name"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Email address *</Label>
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
                <Label htmlFor="contact-phone">Phone number (optional)</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-msg">Message *</Label>
              <Textarea
                id="contact-msg"
                required
                rows={5}
                placeholder="Tell us what you need help with. Include a profile code if your question is about a specific profile."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
              />
            </div>

            {user ? (
              <button
                type="submit"
                disabled={submitting}
                className="sbm-button sbm-button--primary w-full disabled:cursor-wait disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden />
                {submitting ? "Sending..." : "Send message"}
              </button>
            ) : (
              <a href={mailtoHref} className="sbm-button sbm-button--primary w-full">
                <Mail className="h-4 w-4" aria-hidden />
                Open email draft
              </a>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
