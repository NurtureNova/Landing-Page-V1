import FaqSection from "@/components/FaqSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | NurtureNova Learning",
  description: "Find answers to commonly asked questions about NurtureNova Learning's tutoring services, course schedules, pricing, and more.",
};

export default function FAQs() {
  return (
    <div className="bg-[#FFFFFF]">
    <FaqSection />
    </div>
  );
}
