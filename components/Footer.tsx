"use client";

import { Mail, Phone, Linkedin, Instagram, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const socialIcons = [
  {
    icon: <Facebook className="w-6 h-6" />,
    href: "https://www.facebook.com/profile.php?id=61574621054181",
  },
  {
    icon: <Linkedin className="w-6 h-6" />,
    href: "https://www.linkedin.com/company/nurturenova-learning/",
  },
  {
    icon: <Instagram className="w-6 h-6" />,
    href: "https://www.instagram.com/nurturenova_learning?igsh=YzljYTk1ODg3Zg==",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#477EFA] text-white px-6 md:px-28 py-10">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="flex flex-col items-start gap-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Image
            src="/images/all-white.png"
            alt="Logo"
            width={150}
            height={100}
          />
          <div className="flex gap-4 text-[#FE2296]">
            {socialIcons.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="transition-all"
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h4 className="font-semibold font-montserrat text-xl mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-base font-medium font-montserrat ">
            {["Home", "About", "Our Tutors", "FAQs", "Contact"].map((link, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Link href={link === "Home" ? "/" : link === "Our Tutors" ? "/our-tutors" : `/${link.toLowerCase()}`}>
                  {link}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h4 className="font-semibold font-montserrat  text-xl mb-3">
            Contact Info
          </h4>
          <div className="flex font-montserrat font-medium items-center gap-2 text-base mb-2 text-[#FF3366]">
            <Phone className="w-5 h-5" />
            <span className="text-white">+234 707 965 0962</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#FE2296]">
            <Mail className="w-5 h-5" />
            <span className="text-white">nurturenovalearning@gmail.com</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="border-t border-gray-300 mt-10 pt-4 text-center text-base font-montserrat font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        © 2025 Copyright | NurtureNova Learning. All rights reserved
      </motion.div>
    </footer>
  );
}
