import {
  BrainCircuit,
  FileText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

const statistics = [
  {
    icon: BrainCircuit,
    value: "AI",
    label: "Assisted Screening",
  },
  {
    icon: UsersRound,
    value: "3",
    label: "Core User Roles",
  },
  {
    icon: FileText,
    value: "1",
    label: "Structured Workflow",
  },
  {
    icon: ShieldCheck,
    value: "24/7",
    label: "Platform Availability",
  },
];

const Statistics = () => {
  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="bg-slate-950 p-6 text-center sm:p-8"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Icon size={19} />
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400 sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
