import ValuesVisionMission from "@/components/ValuesVisionMission";
import HowWeOperate from "@/components/HowWeOperate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | NurtureNova Learning",
  description: "Learn more about NurtureNova Learning, our mission to empower young minds with personalized academic and tech education, and our unique approach to online learning.",
};

export default function About() {
  return (
    <div className="bg-[#FFFFFF]">
      <ValuesVisionMission />
      <HowWeOperate />
    </div>
  );
}
