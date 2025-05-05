"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const reasons = [
  { 
    title: "1-on-1 Personalised Learning",
    description:
      "Every student is unique. That’s why our sessions are fully personalised — one tutor, one student — tailored to your child’s pace, strengths, and goals.",
    delay: 0.2,
  },
  {
    title: "Experienced & Passionate Tutors",
    description:
      "Our tutors are not only experts in their fields but also committed educators who genuinely care about student growth and confidence.",
    delay: 0.3,
  },
  {
    title: "Academic & Tech Excellence",
    description:
      "From core subjects like Maths, English, and Science to in-demand tech skills like Coding, Web Development, and AI sign — we help your child thrive in both academics and innovation.",
    delay: 0.4,
  },
  {
    title: "Progress Tracking & Feedback",
    description:
      "Parents receive regular updates, monthly assessments, and detailed class reports — so you always know how your child is progressing.",
    delay: 0.5,
  },
  {
    title: "Learn from Anywhere",
    description:
      "All our classes are conducted online via Zoom and supported by tools like Google Classroom. Your child can learn comfortably and safely from home.",
    delay: 0.6,
  },
];

const FadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.5,
      delay: delay,
      ease: "easeInOut",
    },
  },
});

const WhyChooseUs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section>
      <div className="mx-6 lg:mx-28 py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
        {/* Image Section */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src="https://pbs.twimg.com/media/Gp0VUkVWkAAdIp5?format=jpg&name=4096x4096" 
              alt="Learning Platform"
              className="w-[400px] md:max-w-[450px] h-[300px] md:h-[550px] rounded-xl shadow-2xl object-cover drop-shadow"
              width={400}
              height={550}
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Text & Accordion Section */}
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-y-12">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl text-[#111111] md:text-4xl font-montserrat font-bold !leading-snug"
            >
              Why Choose NurtureNova Learning?
            </motion.h1>

            <div className="flex flex-col gap-6">
              {reasons.map((item, index) => (
                <motion.div
                  key={index}
                  variants={FadeUp(item.delay)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="bg-[#f4f4f4] hover:bg-white duration-300 hover:shadow-2xl rounded-2xl p-6"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <p className="text-lg font-semibold text-[#477EFA] font-montserrat">
                      ● {item.title}
                    </p>
                    {activeIndex === index ? (
                      <FiChevronUp className="text-[#477EFA]" />
                    ) : (
                      <FiChevronDown className="text-[#477EFA]" />
                    )}
                  </button>
                  {activeIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-[#111111] font-urbanist font-medium mt-4"
                    >
                      {item.description}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
