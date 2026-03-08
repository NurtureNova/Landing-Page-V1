"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="sticky top-0 w-full z-50 bg-white shadow-sm"
    >
      <div className="mx-6 lg:mx-20 px-8 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ rotate: 10 }}
          className="w-12 h-12 rounded-full flex items-center justify-center"
        >
          <Link href="/">
            <Image
              src="/nurture-nova.png"
              alt="Profile"
              className="rounded-full object-cover w-full"
              width={100}
              height={80}
            />
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center space-x-16 text-[#111111] text-2xl font-semibold">
          {["Home", "About", "Meet Our Team", "Events", "FAQs", "Contact"].map((item) => {
            const href =
              item === "Home"
                ? "/"
                : item === "Meet Our Team"
                  ? "/our-tutors"
                  : `/${item.toLowerCase()}`;
            const isActive = pathname === href;

            return (
              <motion.div key={item}>
                <Link
                  href={href}
                  className={`hover:text-gray-300 ${
                    isActive ? "text-[#FE2296] underline" : "text-[#111111]"
                  }`}
                >
                  {item}
                </Link>
              </motion.div>
            );
          })}
        </div>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-[#111111]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      <div className="mx-6 w-full bg-white/30">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full min-w-5/6 rounded-lg bg-black/20 bg-opacity-80 py-6 flex flex-col items-center space-y-4 text-[#111111] text-xl font-montserrat font-bold"
            >
              {["Home", "About", "Our Tutors", "Events", "FAQs", "Contact"].map((item) => {
                const href = item === "Home" ? "/" : item === "Our Tutors" ? "/our-tutors" : `/${item.toLowerCase()}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={item}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`hover:text-gray-300 ${
                      isActive ? "text-[#FE2296] underline" : "text-[#111111]"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
