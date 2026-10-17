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
    <div className="min-h-screen bg-gradient-to-b from-[#21083F]/[0.02] via-[#F8F7F4] to-[#F8F7F4] py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A514]">
            {SITE_NAME_TE} • COMMUNITY SUPPORT &amp; ALLIANCE HELP
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#21083F]">
            Contact Us
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            We are here to help community members and families with registration, verification, and
            matrimonial support.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border border-[#D9A514]/25 bg-white shadow-sm overflow-hidden">
              <CardHeader className="border-b border-[#D9A514]/15 bg-gradient-to-r from-[#21083F]/5 to-transparent pb-4">
                <CardTitle className="font-serif text-xl font-bold text-[#21083F]">
                  Community Coordination Office
                </CardTitle>
                <CardDescription>Serving Telugu Shettibalija families</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-[#21083F]/5 p-2 text-[#21083F]">
                    <MapPin className="h-5 w-5 text-[#D9A514] shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#21083F]">Regional Coordination Desks</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      Rajahmundry, Kakinada, Visakhapatnam, Vijayawada &amp; Hyderabad Support Desks
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-[#087A32]/10 p-2 text-[#087A32]">
                    <Phone className="h-5 w-5 shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#21083F]">Helpline</p>
                    <p className="text-xs text-muted-foreground">+91 (Office Support Desk)</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Mon – Sat, 9:30 AM to 6:30 PM IST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-[#D9A514]/15 p-2 text-[#D9A514]">
                    <Mail className="h-5 w-5 text-[#21083F] shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#21083F]">Email Support</p>
                    <p className="text-xs text-muted-foreground">
                      support@shettibalijamatrimony.org
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="rounded-3xl border border-[#D9A514]/25 bg-white shadow-xl overflow-hidden">
              <CardHeader className="border-b border-[#D9A514]/15 bg-gradient-to-r from-[#21083F]/5 to-transparent pb-4">
                <CardTitle className="font-serif text-xl font-bold text-[#21083F]">
                  Send an Inquiry
                </CardTitle>
                <CardDescription>
                  Fill out the form below and our coordinators will reach out promptly.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs font-semibold">
                      Your Full Name *
                    </Label>
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
                      <Label htmlFor="contact-email" className="text-xs font-semibold">
                        Email Address *
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
                      <Label htmlFor="contact-phone" className="text-xs font-semibold">
                        Phone Number
                      </Label>
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
                    <Label htmlFor="contact-msg" className="text-xs font-semibold">
                      Message or Inquiry *
                    </Label>
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

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#087A32] to-[#0A963E] hover:from-[#034B21] hover:to-[#087A32] text-white font-bold py-6 shadow-md border border-[#D9A514]/30"
                    disabled={submitting}
                  >
                    <Send className="mr-2 h-4 w-4 text-[#F4D477]" />
                    {submitting ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
