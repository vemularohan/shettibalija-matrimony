import { Link } from "@tanstack/react-router";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";
import { ShettibalijaLogo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#D9A514]/40 bg-[#21083F] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3.5 mb-3">
            <ShettibalijaLogo size="lg" linkToHome theme="dark" />
            <div>
              <p className="font-serif text-xl font-bold text-white">{SITE_NAME}</p>
              <p className="text-xs font-semibold text-[#F3D36A]">{SITE_NAME_TE}</p>
            </div>
          </div>
          <p className="max-w-md text-sm text-white/75 leading-relaxed">
            A trusted community matrimonial platform for Shettibalija families across Telangana,
            Andhra Pradesh and worldwide. All profiles are verified before appearing in search.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F3D36A]">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/search" className="text-white/80 hover:text-[#F3D36A] transition-colors">
                Search Profiles
              </Link>
            </li>
            <li>
              <Link
                to="/membership"
                className="text-white/80 hover:text-[#F3D36A] transition-colors"
              >
                Membership
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white/80 hover:text-[#F3D36A] transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white/80 hover:text-[#F3D36A] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F3D36A]">Policies</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/terms" className="text-white/80 hover:text-[#F3D36A] transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-white/80 hover:text-[#F3D36A] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund" className="text-white/80 hover:text-[#F3D36A] transition-colors">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
