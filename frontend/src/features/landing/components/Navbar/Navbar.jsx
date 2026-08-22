import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
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
    label: "Why RatinoCare",
    href: "#why-ratinocare",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-7xl rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:w-[calc(100%-2rem)] sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
            aria-label="RatinoCare home"
            onClick={closeMenu}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <span className="text-lg font-bold">
                R
              </span>
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              Ratino<span className="text-blue-600">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              Get Started

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex flex-col gap-1">
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <div className="mt-3 flex gap-2 border-t border-slate-200 pt-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;