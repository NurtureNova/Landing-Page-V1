"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="bg-white">
      <div className="mx-16 flex max-w-6xl xl:max-w-full flex-col items-center gap-10 px-6 py-16 md:px-12 lg:flex-row lg:items-start lg:gap-16 lg:py-20 xl:px-16">
        <div className="flex w-full max-w-md justify-center lg:max-w-sm lg:justify-start xl:max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="h-60 w-full shadow-2xl rounded-[40px] overflow-hidden md:h-80 xl:h-96"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Image
              src="https://res.cloudinary.com/ddxssowqb/image/upload/v1745858350/About_US_r9rba3.png"
              alt="Team Member"
              width={500}
              height={500}
              className="h-full w-full object-cover px-4"
              priority
            />
          </motion.div>
        </div>

        <motion.div
          className="max-w-2xl xl:max-w-full text-center lg:text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="text-xl font-montserrat font-bold text-[#FE2296] mb-2">
            About Us
          </p>
          <h2 className="text-3xl font-montserrat font-semibold text-[#111111] md:text-[40px] mb-4">
            Empowering Minds, One Lesson at a Time
          </h2>
          <p className="text-base font-urbanist text-[#78808f] mb-6">
            At NurtureNova Learning, we believe education should be as unique as
            every student. We go beyond traditional tutoring by offering
            personalised, flexible, and tech-integrated learning experiences
            tailored to each child’s journey.
          </p>
          <p className="text-base font-urbanist text-[#78808f] mb-6">
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
              className="rounded-full border border-[#FF3366] bg-[#FE2296] px-5 py-2 text-base font-bold text-white hover:bg-transparent hover:text-[#FE2296]"
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
