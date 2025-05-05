"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import faqIllustration from "@/public/images/faqimg.png";

const faqs = [
  {
    question: "What subjects and grade levels do you offer tutoring for?",
    answer:
      "We offer personalised tutoring for students aged 6 to 18 in Mathematics, English, Science, Verbal Reasoning, Non-Verbal Reasoning, 11+ and GCSE exam preparation.We also provide tech courses such as Scratch Coding, Web Development, Python Programming, AI, and Product Design — all tailored to each student's learning needs.",
  },
  {
    question: "What technology platform and tools do you use to teach?",
    answer:
      "We conduct our online classes using Zoom for live sessions and Google Classroom to share assignments, materials, and track student progress. These tools allow for an interactive, organised, and engaging learning experience.",
  },
  {
    question: "What is the duration and frequency of tutoring sessions?",
    answer:
      "Our tutoring sessions typically last 1 hour and are held once or twice a week, depending on the student's needs and the parent's preference. We offer flexible scheduling to fit your family’s routine.",
  },
  {
    question: "How do I monitor my child’s progress?",
    answer:
      "We provide detailed class reports after each session and conduct monthly assessments to track your child’s progress. Parents also receive regular updates through dedicated WhatsApp groups with the tutor and our team.",
  },
  {
    question: "What should I expect from a session?",
    answer:
      "Each session is personalised to your child's needs and includes a review of previous work, introduction of new topics, interactive learning, and practice exercises. Tutors also provide detailed feedback and answer any questions your child may have.",
  },
  {
    question: "How many students are in a class?",
    answer:
      "All our classes are one-on-one. Each student is paired with a dedicated tutor to ensure personalised attention and a customised learning experience.",
  },
  {
    question: "What materials/curriculum are used to teach?",
    answer:
      "We use a blend of trusted resources aligned with the UK curriculum, including past papers, exam practice materials like GL Assessment for 11+ exams, and custom materials developed by our tutors. For tech courses, we follow project-based curricula designed to build real-world skills.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="pb-16 pt-32 px-6 md:px-20 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center text-[#FE2296] mb-12"
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Illustration */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={faqIllustration}
            alt="FAQ Illustration"
            className="w-full max-w-md"
          />
        </motion.div>

        {/* Right Accordion */}
        <motion.div
          className="md:w-1/2 space-y-4 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 px-6 py-4 rounded-lg shadow-sm cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <p className="text-base font-medium text-gray-800">
                  {faq.question}
                </p>
                <span className="text-[#FE2296] text-2xl font-bold">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-[#477EFA] font-montserrat mt-2"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
