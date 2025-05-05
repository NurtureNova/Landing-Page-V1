"use client";

import HeroSection from "@/components/HeroSection";
// import Counter from "@/components/Counter";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialSection from "@/components/TestimonialSection";
import HeroSection2 from "@/components/HeroSection2";

export default function Home() {
  return (
    <div className="bg-[#FFFFFF]">
      <HeroSection />
      {/* <Counter /> */}
      <AboutSection />
      <CoursesSection />
      <WhyChooseUs />
      <TestimonialSection />
      <HeroSection2 />
    </div>
  );
}
