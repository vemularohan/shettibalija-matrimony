import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Search, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShettibalijaLogo } from "@/components/brand/logo";
import { useLanguage } from "@/lib/i18n";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import heroImage from "@/assets/hero-wedding-telangana.jpg";

type ProfileFor = "myself" | "daughter" | "son" | "brother" | "sister" | "relative" | "friend";

const PROFILE_FOR_OPTIONS: { value: ProfileFor; en: string; te: string }[] = [
  { value: "myself", en: "Myself", te: "నా కోసం" },
  { value: "daughter", en: "Daughter", te: "కుమార్తె" },
  { value: "son", en: "Son", te: "కుమారుడు" },
  { value: "brother", en: "Brother", te: "సోదరుడు" },
  { value: "sister", en: "Sister", te: "సోదరి" },
  { value: "relative", en: "Relative", te: "బంధువు" },
  { value: "friend", en: "Friend", te: "స్నేహితుడు" },
];

export function HeroPhotoGallery() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [profileFor, setProfileFor] = useState<ProfileFor>("myself");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isTelugu = lang === "te";

  function handleProfileForChange(value: ProfileFor) {
    setProfileFor(value);
    if (value === "daughter" || value === "sister") setGender("female");
    if (value === "son" || value === "brother") setGender("male");
  }

  function handleRegister(event: FormEvent) {
    event.preventDefault();
    const mobile = mobileNumber.replace(/\D/g, "");
    if (!fullName.trim()) {
      toast.error(isTelugu ? "దయచేసి పేరు నమోదు చేయండి" : "Please enter the candidate's name");
      return;
    }
    if (mobile.length < 10) {
      toast.error(
        isTelugu
          ? "సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి"
          : "Please enter a valid 10-digit mobile number",
      );
      return;
    }
    if (!termsAccepted) {
      toast.error(
        isTelugu ? "దయచేసి నిబంధనలను అంగీకరించండి" : "Please accept the Terms and Privacy Policy",
      );
      return;
    }
    void navigate({
      to: "/register",
      search: {
        name: fullName.trim(),
        mobile,
        gender: gender === "male" ? "groom" : "bride",
        profileFor,
      },
    });
  }

  return (
    <section className="front-door">
      <div className="front-door__hero">
        <img
          className="front-door__image"
          src={heroImage}
          alt="A groom receiving a traditional blessing during a Telangana Hindu wedding ceremony"
          fetchPriority="high"
        />
        <div className="front-door__wash" />
        <div className="front-door__content">
          <div className="front-door__copy">
            <div className="front-door__eyebrow">
              <ShettibalijaLogo size="sm" priority />
              <span>
                <strong>{SITE_NAME}</strong>
                <small>{SITE_NAME_TE}</small>
              </span>
            </div>
            <p className="front-door__overline">
              {isTelugu
                ? "మన సమాజం కోసం నిర్మించిన వేదిక"
                : "A community-first matrimonial platform"}
            </p>
            <h1>
              {isTelugu ? (
                <>
                  మీ విలువలను పంచుకునే
                  <br />
                  <em>జీవిత భాగస్వామిని కనుగొనండి.</em>
                </>
              ) : (
                <>
                  Find your life partner
                  <br />
                  <em>within your community.</em>
                </>
              )}
            </h1>
            <p className="front-door__description">
              {isTelugu
                ? "శెట్టిబలిజ కుటుంబాలు మరియు వ్యక్తుల కోసం గౌరవప్రదమైన, విశ్వసనీయమైన వివాహ పరిచయాలు."
                : "Meaningful introductions for Shettibalija individuals and families, shaped by shared values, culture and trust."}
            </p>
            <div className="front-door__actions">
              <a href="#find-your-match" className="front-door__search-link">
                <Search size={17} />
                {isTelugu ? "మీ మ్యాచ్‌ను కనుగొనండి" : "Find your match"}
              </a>
              <span className="front-door__member-note">
                {isTelugu ? "ఇప్పటికే సభ్యులా?" : "Already a member?"}{" "}
                <Link to="/login" search={{}}>
                  {isTelugu ? "లాగిన్" : "Login"}
                </Link>
              </span>
            </div>
            <div className="front-door__trust">
              <span>
                <Check size={13} /> {isTelugu ? "కమ్యూనిటీ కేంద్రితం" : "Community focused"}
              </span>
              <span>
                <Check size={13} /> {isTelugu ? "గోప్యత రక్షణ" : "Privacy protected"}
              </span>
            </div>
          </div>

          <div className="front-door__register">
            <div className="front-door__register-heading">
              <div>
                <span className="front-door__register-kicker">
                  <UserPlus size={15} /> {isTelugu ? "కొత్త సభ్యుల కోసం" : "For new members"}
                </span>
                <h2>
                  {isTelugu
                    ? "మీ మ్యాట్రిమోనీ ప్రొఫైల్ సృష్టించండి"
                    : "Create your Matrimony Profile"}
                </h2>
                <p>
                  {isTelugu
                    ? "ఉచితంగా ప్రారంభించి తగిన పరిచయాలను కనుగొనండి."
                    : "Begin free and meet meaningful community introductions."}
                </p>
              </div>
              <span className="front-door__free">{isTelugu ? "ఉచితం" : "Free"}</span>
            </div>
            <form onSubmit={handleRegister}>
              <Label>{isTelugu ? "ప్రొఫైల్ ఎవరి కోసం?" : "Profile created for"}</Label>
              <div className="front-door__profile-options">
                {PROFILE_FOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={profileFor === option.value ? "is-selected" : ""}
                    onClick={() => handleProfileForChange(option.value)}
                  >
                    {isTelugu ? option.te : option.en}
                  </button>
                ))}
              </div>
              <div className="front-door__register-row">
                <div>
                  <Label htmlFor="hero-name">{isTelugu ? "పేరు" : "Name"}</Label>
                  <Input
                    id="hero-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder={isTelugu ? "పూర్తి పేరు" : "Enter candidate's name"}
                    required
                  />
                </div>
                <div>
                  <Label>{isTelugu ? "లింగం" : "Gender"}</Label>
                  <div className="front-door__gender">
                    <button
                      type="button"
                      className={gender === "female" ? "is-selected" : ""}
                      onClick={() => setGender("female")}
                    >
                      {isTelugu ? "వధువు" : "Bride"}
                    </button>
                    <button
                      type="button"
                      className={gender === "male" ? "is-selected" : ""}
                      onClick={() => setGender("male")}
                    >
                      {isTelugu ? "వరుడు" : "Groom"}
                    </button>
                  </div>
                </div>
              </div>
              <Label htmlFor="hero-mobile">{isTelugu ? "మొబైల్ నంబర్" : "Mobile number"}</Label>
              <div className="front-door__mobile">
                <span>+91</span>
                <Input
                  id="hero-mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value)}
                  placeholder={isTelugu ? "10 అంకెల నంబర్" : "Enter mobile number"}
                  required
                />
              </div>
              <label className="front-door__consent">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                />
                <span>
                  {isTelugu ? (
                    <>
                      <Link to="/terms">నిబంధనలు</Link> మరియు{" "}
                      <Link to="/privacy">గోప్యతా విధానాన్ని</Link> అంగీకరిస్తున్నాను.
                    </>
                  ) : (
                    <>
                      I agree to the <Link to="/terms">Terms of Use</Link> and{" "}
                      <Link to="/privacy">Privacy Policy</Link>.
                    </>
                  )}
                </span>
              </label>
              <button type="submit" className="front-door__register-submit">
                {isTelugu ? "ప్రొఫైల్ సృష్టించండి" : "Create Profile"} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
