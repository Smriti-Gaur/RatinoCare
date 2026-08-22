import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "How It Works",
      href: "#how-it-works",
    },
    {
      label: "AI Detection",
      href: "#ai-detection",
    },
    {
      label: "FAQ",
      href: "#faq",
    },
  ],
  Account: [
    {
      label: "Log in",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
    },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-14">

        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <span className="text-lg font-bold">
                  R
                </span>
              </div>

              <span className="text-lg font-bold">
                Ratino<span className="text-blue-400">Care</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              An AI-oriented retinal screening platform designed
              to support structured healthcare workflows.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="RatinoCare email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
              >
                <Mail size={16} />
              </a>

              

              

              
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.Platform.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Account
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.Account.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} RatinoCare. All rights reserved.
            </p>

            <p>
              AI-assisted screening • Human-centered care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;