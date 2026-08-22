import {
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

const perspectives = [
  {
    icon: Stethoscope,
    role: "For Doctors",
    title: "Focus on clinical review, not scattered information.",
    description:
      "RatinoCare is designed to bring patient information, screening insights, appointments, and reports into a structured workflow.",
  },
  {
    icon: UserRound,
    role: "For Patients",
    title: "Make the screening journey easier to understand.",
    description:
      "Patients can access their appointments, screening information, and relevant reports through a dedicated workflow.",
  },
  {
    icon: UsersRound,
    role: "For Administrators",
    title: "Keep the healthcare workflow organized.",
    description:
      "Role-based access and centralized workflows help administrators manage the platform more efficiently.",
  },
];

const UserPerspectives = () => {
  return (
    <section className="bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-blue-600"
          >
            DESIGNED FOR PEOPLE
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            One platform.
            <span className="block text-blue-600">
              Different needs.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base leading-7 text-slate-600 sm:text-lg"
          >
            RatinoCare is structured around the people involved
            in the screening and care workflow.
          </motion.p>
        </div>

        {/* Perspectives */}
        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
          {perspectives.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.role}
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
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={22} />
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                  {item.role}
                </p>

                <h3 className="mt-3 text-xl font-bold leading-7 text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <p className="text-sm leading-6 text-slate-600">
            RatinoCare is designed to support healthcare workflows.
            Screening information should always be interpreted in
            the appropriate clinical context.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default UserPerspectives;
