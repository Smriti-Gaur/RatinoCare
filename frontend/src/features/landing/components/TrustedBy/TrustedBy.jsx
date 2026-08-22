import { BrainCircuit, Eye, HeartPulse, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Eye,
    label: "Retinal Screening",
  },
  {
    icon: BrainCircuit,
    label: "AI-Assisted Analysis",
  },
  {
    icon: HeartPulse,
    label: "Healthcare Workflows",
  },
  {
    icon: ShieldCheck,
    label: "Secure Platform",
  },
];

const TrustedBy = () => {
  return (
    <section className="border-y border-slate-100 bg-slate-50/70">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:text-left">
            Built for modern retinal screening
          </p>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto lg:gap-8">
            {trustItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="flex items-center justify-center gap-2 text-center sm:justify-start"
                >
                  <Icon
                    size={17}
                    className="shrink-0 text-blue-600"
                  />

                  <span className="text-xs font-medium text-slate-600 sm:text-sm">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;