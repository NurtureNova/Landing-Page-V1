"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
  },
};

const statsVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.6,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 20, rotate: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function HowItStarted() {
  return (
    <section className="bg-white py-16 mt-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          className="bg-white p-6 md:p-10 rounded-2xl shadow-xl"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-[#FF3366] text-xl font-medium mb-3">
            How It Started
          </p>
          <h2 className="text-3xl md:text-4xl text-[#000000] font-extrabold leading-snug mb-4">
            Our dream is to teach children to be{" "}
            <span className="text-[#FF3366]">creative</span>
          </h2>
          <p className="text-gray-700 mb-4">
            Nurture Nova Learning was founded in response to the challenges
            brought about by the pandemic...
          </p>
          <p className="text-gray-700 mb-4">
            We offer personalized tutoring sessions in Mathematics, English, and
            Sciences...
          </p>
          <p className="font-semibold text-gray-900">
            Our goal is simple: to make learning as easy and seamless as
            possible...
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={statsVariants}
        >
          <motion.div
            className="overflow-hidden rounded-2xl shadow-xl"
            variants={imageVariants}
          >
            <Image
              src="/images/team.jpg"
              alt="The Nurture Nova Team"
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 bg-white rounded-2xl shadow-xl p-6"
            variants={statsVariants}
          >
            {[
              { number: "45+", label: "Students" },
              { number: "30+", label: "Tutors" },
              { number: "5+", label: "Countries", full: true },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`bg-[#d5e9f9] rounded-lg p-4 text-center ${
                  stat.full ? "col-span-2" : ""
                }`}
                variants={statItemVariants}
              >
                <h3 className="text-2xl text-[#000000] font-bold">
                  {stat.number}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
