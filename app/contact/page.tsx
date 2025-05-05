"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("https://nurture-nova.netlify.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus("success");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="bg-white pt-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <motion.h2
          className="mb-4 text-4xl tracking-tight font-extrabold font-montserrat text-center text-[#FE2296]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h2>

        <motion.p
          className="mb-8 lg:mb-16 font-light font-montserrat text-center text-[#111111] text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Got a technical issue? Want to send feedback about a beta feature?
          Need details about our Business plan? Let us know.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label
              htmlFor="email"
              className="block mb-2 text-xl font-medium text-[#111111]"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-[#111111] text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="nurturenovalearning@gmail.com"
              required
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label
              htmlFor="subject"
              className="block mb-2 text-xl font-medium text-[#111111]"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="block p-3 w-full text-base text-[#111111] bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Let us know how we can help you"
              required
            />
          </motion.div>
          <div>
            <input type="text" name="honeypot" style={{ display: "none" }} />
          </div>
          <motion.div
            className="sm:col-span-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label
              htmlFor="message"
              className="block mb-2 text-xl font-medium text-[#111111]"
            >
              Your message
            </label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block p-2.5 w-full text-base text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Leave a comment..."
              required
            ></textarea>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-5 text-lg font-montserrat font-medium text-center text-white rounded-lg bg-[#FE2296] hover:bg-[#e6295b] transition focus:ring-4 focus:outline-none focus:ring-primary-300"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
            {status === "success" && (
              <p className="mt-4 text-green-600">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="mt-4 text-red-600">
                Something went wrong. Try again.
              </p>
            )}
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
}
