import { ArrowRight, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const trustPoints = [
  {
    icon: BrainCircuit,
    label: "AI-assisted screening",
  },
  {
    icon: Zap,
    label: "Fast analysis",
  },
  {
    icon: ShieldCheck,
    label: "Secure platform",
  },
];

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-white pt-32 sm:pt-36 lg:pt-40"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute -right-40 top-40 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>

              AI-POWERED RETINAL SCREENING
            </div>

            {/* Heading */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
              Detect earlier.
              <span className="block text-blue-600">
                Care smarter.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              RatinoCare helps transform retinal images into
              intelligent screening insights, supporting
              healthcare professionals in identifying signs of
              diabetic retinopathy earlier.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Start Screening

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                See How It Works
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {trustPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm text-slate-600"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                      <Icon size={16} />
                    </div>

                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-900/10 sm:p-4">
              
              {/* Main visual */}
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950">
                
                {/* Decorative circles */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20"
                />

                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20"
                />

                {/* Retina placeholder */}
                <div className="absolute left-1/2 top-1/2 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 shadow-[0_0_80px_rgba(34,211,238,0.15)]">
                  <div className="h-[72%] w-[72%] rounded-full border border-cyan-300/30 bg-slate-900/80 shadow-[inset_0_0_40px_rgba(34,211,238,0.1)]" />
                </div>

                {/* AI scanning line */}
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: "200%" }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-[18%] right-[18%] top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_16px_rgba(103,232,249,0.8)]"
                />

                {/* AI badge */}
                <div className="absolute left-5 top-5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <BrainCircuit
                      size={16}
                      className="text-cyan-300"
                    />

                    <span className="text-xs font-semibold text-white">
                      AI ANALYSIS
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-md">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Screening status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Analysis ready
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:-left-6"
            >
              <p className="text-xs font-medium text-slate-500">
                AI-assisted
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                Retinal screening
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;