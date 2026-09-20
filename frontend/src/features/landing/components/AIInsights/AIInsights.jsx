import {
  FileText,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Stethoscope,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const extractedParams = [
  {
    parameter: "HbA1c Level",
    value: "7.4 %",
    trend: "+0.6% vs previous",
    trendStatus: "warning",
    refRange: "4.0 - 5.6 %",
  },
  {
    parameter: "Fasting Blood Glucose",
    value: "138 mg/dL",
    trend: "Stable trend",
    trendStatus: "normal",
    refRange: "70 - 99 mg/dL",
  },
  {
    parameter: "Screening Recommendation",
    value: "Annual Fundus Exam",
    trend: "Rule Met: Flagged",
    trendStatus: "flagged",
    refRange: "Doctor Review Suggested",
  },
];

const AIInsights = () => {
  return (
    <section
      id="ai-insights"
      className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Background Glow Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-sm font-semibold text-cyan-300">
              <Sparkles size={15} />
              AI-ASSISTED REPORT INSIGHTS
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Turn medical reports into
              <span className="block text-cyan-300">
                clear, actionable trends.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              RatinoCare helps patients and doctors understand uploaded medical
              reports, track parameters across time, and highlight notable
              changes — with auditable rules that flag cases for doctor review.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <FileText size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Structured Report Parsing
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Extracts test names, numeric values, reference ranges, and
                    dates into patient-friendly summaries.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <TrendingUp size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Longitudinal Trend Comparison
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Monitors compatible indicators over successive screening
                    visits to highlight progress and risk changes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Rule-Based Doctor Escalation
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Configurable rules automatically flag key report findings so
                    doctors can review priority cases promptly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side UI Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-4">

              {/* Card Window Header */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <FileText size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Lab Report & Screening Summary
                      </p>

                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={12} /> Screening Date: Sept 2026
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
                    <AlertTriangle size={11} />
                    FLAGGED FOR REVIEW
                  </span>
                </div>
              </div>

              {/* Main Report Extracted Workspace */}
              <div className="mt-3 space-y-3">

                {/* Extracted Parameters Grid */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {extractedParams.map((item) => {
                    const isWarning = item.trendStatus === "warning";
                    const isFlagged = item.trendStatus === "flagged";

                    return (
                      <div
                        key={item.parameter}
                        className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5"
                      >
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          {item.parameter}
                        </p>

                        <div className="mt-1.5 flex items-baseline justify-between">
                          <p className="text-lg font-bold text-white">
                            {item.value}
                          </p>

                          {isWarning ? (
                            <span className="flex items-center text-[11px] font-semibold text-amber-400">
                              <ArrowUpRight size={13} /> {item.trend}
                            </span>
                          ) : isFlagged ? (
                            <span className="flex items-center text-[11px] font-semibold text-cyan-300">
                              <Stethoscope size={13} className="mr-0.5" /> Flagged
                            </span>
                          ) : (
                            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
                              <CheckCircle2 size={13} className="mr-0.5" /> Normal
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Ref: {item.refRange}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Rule-based Doctor Flag Banner */}
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-300"
                    />

                    <div>
                      <h4 className="text-xs font-semibold text-amber-200">
                        Rule Engine Notification: Doctor Escalation
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-amber-200/80">
                        HbA1c level increased by &gt;0.5% compared to previous
                        screening report. System rule automatically assigned
                        report for doctor consultation review.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Human Doctor Review Status */}
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Stethoscope size={16} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Doctor Review Status
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Assigned to Dr. Retinal Specialist
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300 border border-blue-400/20">
                    Pending Consultation
                  </span>
                </div>

                {/* Disclaimer */}
                <div className="border-t border-white/10 pt-3 text-center sm:text-left">
                  <p className="text-[11px] leading-5 text-slate-500">
                    * AI report insights assist patients and clinicians by structuring and monitoring data. Final clinical recommendations are provided directly by your physician.
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
