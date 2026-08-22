import { ArrowRight, BrainCircuit, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-blue-600 px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20"
      >
        {/* Decorative elements */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-800/30 blur-3xl"
        />

        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
            <BrainCircuit size={27} />
          </div>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Build a smarter retinal screening workflow with RatinoCare.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
            Explore the platform, connect with your healthcare
            workflow, and move toward more structured screening
            experiences.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Get Started

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-xs text-blue-100 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} />
              Secure access
            </span>

            <span className="flex items-center gap-2">
              <BrainCircuit size={15} />
              AI-ready architecture
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;

