import { Link } from "@tanstack/react-router";
import { SITE_NAME, SITE_NAME_TE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-[#f7f4ef]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-xl text-primary">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-gold-foreground">{SITE_NAME_TE}</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A community matrimonial platform for Shettibalija families across Telangana and Andhra
            Pradesh. Profiles are reviewed before they appear in search.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/search" className="hover:text-primary">
                Search Profiles
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-primary">
                Membership
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Policies</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/terms" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-primary">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
