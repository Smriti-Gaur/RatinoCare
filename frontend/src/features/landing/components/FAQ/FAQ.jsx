import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "What is RatinoCare?",
    answer:
      "RatinoCare is an AI-oriented diabetic retinopathy screening platform designed to bring retinal image screening, patient workflows, appointments, and reports into one application.",
  },
  {
    question: "Does RatinoCare replace a doctor?",
    answer:
      "No. RatinoCare is designed as a screening-support platform. AI-assisted insights are intended to support healthcare professionals rather than replace clinical judgment.",
  },
  {
    question: "Who can use RatinoCare?",
    answer:
      "The platform is designed around three primary roles: patients, doctors, and administrators. Each role can have different workflows and permissions.",
  },
  {
    question: "Can retinal images be analyzed using AI?",
    answer:
      "The platform is being designed to support AI-assisted retinal image analysis. The actual screening model and prediction capabilities will depend on the AI system integrated into the backend.",
  },
  {
    question: "Can patients manage appointments?",
    answer:
      "Yes. The platform architecture supports appointment and slot workflows, allowing patients and doctors to interact with relevant appointment information.",
  },
  {
    question: "Is RatinoCare a medical diagnosis system?",
    answer:
      "RatinoCare should be treated as a screening-support application unless and until its clinical validation, regulatory requirements, and intended use are formally established.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleQuestion = (index) => {
    setOpenIndex((current) =>
      current === index ? -1 : index
    );
  };

  return (
    <section
      id="faq"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <span className="text-sm font-semibold text-blue-600">
            FAQ
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Questions, answered.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Everything you need to know about the RatinoCare
            platform and its intended screening workflow.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={19}
                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                    >
                      <div className="border-t border-blue-100 px-5 pb-5 pt-4 sm:px-6">
                        <p className="text-sm leading-6 text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;