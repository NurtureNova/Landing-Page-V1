"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const teamMembers = [
  {
    src: "https://pbs.twimg.com/media/Gp0Sns3XsAAjUkR?format=jpg&name=4096x4096",
    alt: "Team Member 2",
  },
];

const imageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      type: "spring",
      stiffness: 100,
    },
  }),
};

export default function AboutSection() {
  return (
    <section className="py-16 px-6 md:px-28 bg-white flex flex-col lg:flex-row items-center justify-between">
      <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={imageVariants}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="h-60 md:w-80 md:h-88 shadow-2xl rounded-[40px] overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Image
              src={member.src}
              alt={member.alt}
              width={550}
              height={400}
              className="object-cover w-full h-full px-4"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="lg:ml-16 mt-10 lg:mt-0 text-center lg:text-left max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p className="text-[#FE2296] text-xl font-montserrat font-bold mb-2">
          About Us
        </p>
        <h2 className="text-3xl md:text-[40px] text-[#111111] font-montserrat font-semibold mb-4">
          Empowering Minds, One Lesson at a Time
        </h2>
        <p className="text-[#78808f] text-base font-urbanist mb-6">
          At NurtureNova Learning, we believe education should be as unique as
          every student. We go beyond traditional tutoring by offering
          personalised, flexible, and tech-integrated learning experiences
          tailored to each child’s journey.
        </p>
        <p className="text-[#78808f] text-base font-urbanist mb-6">
          Whether you&apos;re based in the UK, Canada, Nigeria, or beyond, our
          approach combines strong academic support with future-ready skills —
          empowering students to thrive in both school and the ever-evolving
          digital world.
        </p>
        <Link href="/about">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-[#FE2296] text-white hover:bg-transparent hover:text-[#FE2296] border border-[#FF3366] text-base font-bold px-5 py-2 rounded-full"
          >
            Learn More
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
