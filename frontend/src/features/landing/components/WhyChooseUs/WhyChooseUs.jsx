import {
  BrainCircuit,
  LockKeyhole,
  Network,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: BrainCircuit,
    title: "AI-assisted intelligence",
    description:
      "Designed to bring intelligent image analysis into the retinal screening workflow while keeping clinical professionals in control.",
  },
  {
    icon: Stethoscope,
    title: "Clinician-centered",
    description:
      "Screening information is organized to support professional review rather than replacing clinical judgment.",
  },
  {
    icon: LockKeyhole,
    title: "Security-conscious",
    description:
      "Patient and screening workflows are designed with secure authentication and controlled access in mind.",
  },
  {
    icon: Network,
    title: "Built to scale",
    description:
      "A modular architecture allows RatinoCare to grow from screening workflows into a broader healthcare platform.",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      id="why-ratinocare"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-blue-600">
              WHY RATINOCARE
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Technology that supports
              <span className="block text-blue-600">
                better screening workflows.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
          >
            RatinoCare combines healthcare workflows with
            intelligent technology to make retinal screening more
            structured, accessible, and easier to review.
          </motion.p>
        </div>

        {/* Benefits */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.article
                key={benefit.title}
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
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-7"
              >
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-500"
                  />
                </div>

                <h3 className="mt-8 text-lg font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                THE RATINOCARE APPROACH
              </p>

              <p className="mt-2 max-w-2xl text-lg font-semibold text-slate-900 sm:text-xl">
                Intelligent technology should make healthcare
                workflows clearer—not more complicated.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <BrainCircuit
                  size={18}
                  className="text-blue-600"
                />

                <span className="text-sm font-semibold text-slate-700">
                  AI + Human Expertise
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;