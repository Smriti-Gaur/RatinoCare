import {
  BrainCircuit,
  FileText,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Assisted Screening",
    description:
      "Analyze retinal images with intelligent screening support designed to help identify potential signs of diabetic retinopathy.",
    className: "md:col-span-2",
  },
  {
    icon: Activity,
    title: "Risk Insights",
    description:
      "Turn complex screening signals into clear, understandable risk indicators.",
    className: "",
  },
  {
    icon: FileText,
    title: "Structured Reports",
    description:
      "Generate organized screening reports that can support clinical review and documentation.",
    className: "",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workflows",
    description:
      "Keep patient, appointment, and screening information organized within a secure application workflow.",
    className: "md:col-span-2",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-blue-600"
          >
            WHAT RATINOCARE OFFERS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Everything you need for
            <span className="block text-blue-600">
              smarter screening workflows.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base leading-7 text-slate-600 sm:text-lg"
          >
            RatinoCare brings AI-assisted screening, patient
            workflows, reporting, and clinical insights together
            in one platform.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-xl hover:shadow-blue-900/5 sm:p-8 ${feature.className}`}
              >
                {/* Decorative glow */}
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl transition-opacity group-hover:opacity-100"
                />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-100">
                      <Icon size={22} />
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="text-slate-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-500"
                    />
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;