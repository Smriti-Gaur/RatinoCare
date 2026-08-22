import {
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Eye,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const findings = [
  {
    label: "Image quality",
    value: "Good",
    icon: CheckCircle2,
    status: "success",
  },
  {
    label: "Screening signal",
    value: "Requires review",
    icon: CircleAlert,
    status: "warning",
  },
  {
    label: "AI assessment",
    value: "Assisted analysis",
    icon: BrainCircuit,
    status: "info",
  },
];

const AIDetection = () => {
  return (
    <section
      id="ai-detection"
      className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-sm font-semibold text-cyan-300">
              <Sparkles size={15} />
              AI-POWERED SCREENING
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Turn retinal images into
              <span className="block text-cyan-300">
                meaningful insights.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              RatinoCare is designed to combine retinal image
              analysis with structured screening information,
              helping healthcare professionals review potential
              findings more efficiently.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <ScanSearch size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Image-aware analysis
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Designed to process retinal imagery as part
                    of a structured screening workflow.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <Eye size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Clear screening insights
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Present complex analysis in a format that's
                    easier for clinicians to review.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Human-centered decisions
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    AI is designed to support clinical review,
                    not replace professional judgment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-4">

              {/* Window header */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <BrainCircuit size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Retinal AI Screening
                      </p>

                      <p className="text-xs text-slate-500">
                        Analysis workspace
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
                    AI ASSISTED
                  </span>
                </div>
              </div>

              {/* Main workspace */}
              <div className="mt-3 grid gap-3 md:grid-cols-2">

                {/* Image preview */}
                <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

                  {/* Placeholder retina */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-red-500/10 via-cyan-400/10 to-blue-500/10 shadow-[0_0_100px_rgba(34,211,238,0.08)]">
                      <div className="h-40 w-40 rounded-full border border-red-300/20 bg-red-500/5" />

                      <div className="absolute h-24 w-24 rounded-full border border-cyan-300/20" />

                      {/* Scan marker */}
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-4 rounded-full border border-dashed border-cyan-300/30"
                      />
                    </div>
                  </div>

                  {/* Scan line */}
                  <motion.div
                    animate={{
                      y: ["-120%", "350%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_rgba(103,232,249,0.8)]"
                  />

                  {/* Image label */}
                  <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Retinal image
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-white">
                      Screening sample
                    </p>
                  </div>
                </div>

                {/* Analysis panel */}
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">
                        Screening overview
                      </p>

                      <p className="mt-1 text-base font-semibold text-white">
                        AI-assisted insights
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <BrainCircuit size={17} />
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="mt-6 space-y-3">
                    {findings.map((finding) => {
                      const Icon = finding.icon;

                      const iconClass =
                        finding.status === "success"
                          ? "text-emerald-300 bg-emerald-400/10"
                          : finding.status === "warning"
                            ? "text-amber-300 bg-amber-400/10"
                            : "text-cyan-300 bg-cyan-400/10";

                      return (
                        <div
                          key={finding.label}
                          className="rounded-xl border border-white/10 bg-white/[0.025] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
                            >
                              <Icon size={15} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">
                                {finding.label}
                              </p>

                              <p className="mt-0.5 truncate text-sm font-medium text-slate-200">
                                {finding.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-[11px] leading-5 text-slate-500">
                      Illustrative interface preview. Actual AI
                      screening outputs will depend on the
                      implemented analysis model and clinical
                      workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIDetection;