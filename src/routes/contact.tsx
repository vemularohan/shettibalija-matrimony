import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/errors";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (user?.id) {
        const { error } = await supabase.from("support_requests").insert({
          owner_id: user.id,
          subject: `Inquiry from ${name.trim()} (${phone.trim() || email.trim()})`,
          message: message.trim(),
          status: "open",
        });

        if (error) throw error;
      }

      toast.success("Your message has been sent. Our team will contact you shortly.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Failed to send message. Please try again or reach out by phone."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold-foreground">
          {SITE_NAME_TE}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary md:text-5xl">Contact Us</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We are here to help community members and families with registration, verification, and
          support.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Community Coordination Office</CardTitle>
              <CardDescription>Serving Telugu Shettibalija families</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Head Office</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Shettibalija Community Center, Main Road, Rajahmundry & Hyderabad Regional Desks
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Helpline</p>
                  <p className="text-xs text-muted-foreground">+91 (Office Support Desk)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Mon – Sat, 9:30 AM to 6:30 PM IST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@shettibalijamatrimony.org</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Send an Inquiry</CardTitle>
              <CardDescription>
                Fill out the form below and our coordinators will reach out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name">Your Full Name *</Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email Address *</Label>
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
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-msg">Message or Inquiry *</Label>
                  <Textarea
                    id="contact-msg"
                    required
                    rows={4}
                    placeholder="How can we assist you with profile registration, verification, or membership?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
