import {
  UserPlus,
  Search,
  CalendarCheck,
  Stethoscope,
  FileCheck2,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create an Account",
    description:
      "Register as a patient to manage your screening appointments and health profile.",
  },
  {
    number: "02",
    icon: Search,
    title: "Explore Doctors",
    description:
      "Find eye care specialists and screening services tailored to diabetic retinopathy.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Book Available Slot",
    description:
      "Select a convenient date and time slot with your chosen healthcare specialist.",
  },
  {
    number: "04",
    icon: Stethoscope,
    title: "Screening Consultation",
    description:
      "Attend your appointment for retinal screening and professional examination.",
  },
  {
    number: "05",
    icon: FileCheck2,
    title: "Reports & AI Insights",
    description:
      "Access structured reports, track longitudinal trends, and review doctor feedback.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-blue-600"
          >
            HOW IT WORKS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            A simple digital workflow for
            <span className="block text-blue-600">
              retinal screening appointments.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base leading-7 text-slate-600 sm:text-lg"
          >
            RatinoCare connects patients with doctors, streamlines screening
            appointments, and delivers clear report history and AI-assisted insights.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">

          {/* Desktop connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 lg:block"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
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
                  className="relative text-center"
                >
                  {/* Icon */}
                  <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                    <Icon size={25} />

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-base font-bold text-slate-900 sm:text-lg">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-16 max-w-3xl rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm sm:p-6"
        >
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            <span className="font-semibold text-slate-900">
              AI assists the screening workflow.
            </span>{" "}
            Clinical professionals remain responsible for interpreting
            results and making appropriate care decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;