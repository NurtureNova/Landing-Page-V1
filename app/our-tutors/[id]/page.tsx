"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  GraduationCap,
  Heart,
  Award,
  ArrowLeft,
  Globe,
  User,
  Clock,
} from "lucide-react";
import { getTutorById, calculateNurtureNovaExperience } from "@/data/tutors";

export default function TutorDetailPage() {
  const params = useParams();
  const tutorId = params.id as string;
  const tutor = getTutorById(tutorId);

  if (!tutor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Tutor Not Found
          </h1>
          <Link href="/our-tutors">
            <button className="bg-[#FE2296] text-white px-6 py-3 rounded-lg">
              Back to Tutors
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <motion.section
        className="bg-[#477EFA] pt-32 pb-16 px-6 md:px-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <Link href="/our-tutors">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex bg-[#FE2296] px-6 py-3 rounded-xl items-center gap-2 text-white mb-8 hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-montserrat">Back to Tutors</span>
            </motion.button>
          </Link>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative">
                <div className="w-full bg-white h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={tutor.image}
                    alt={tutor.name}
                    fill
                    className="w-[866px] h-[1080px]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tutor.nationality}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{tutor.gender}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
                  {tutor.name}
                </h1>

                <p className="text-xl md:text-2xl text-white/90 mb-6 font-urbanist">
                  {tutor.position}
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">With NurtureNova</span>
                  </div>
                  <div className="text-lg font-bold">
                    {calculateNurtureNovaExperience(
                      tutor.nurtureNovaStartDate,
                      tutor.isActive
                    )}
                  </div>
                  <div className="text-sm text-white/80">
                    Since{" "}
                    {new Date(tutor.nurtureNovaStartDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tutor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-16 px-6 md:px-28">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#111111] mb-6 font-montserrat">
                About {tutor.name}
              </h2>
              <div className="text-gray-700 text-lg leading-relaxed font-urbanist space-y-4">
                {tutor.bio.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Academic Background */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-[#111111] mb-6 font-montserrat flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#477EFA]" />
                Academic Background
              </h3>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-[#477EFA] font-montserrat">
                    {tutor.academicBackground.degree}
                  </h4>
                  <p className="text-gray-600 font-urbanist">
                    {tutor.academicBackground.institution} •{" "}
                    {tutor.academicBackground.year}
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2 font-montserrat">
                    Additional Certifications:
                  </h5>
                  <ul className="space-y-1">
                    {tutor.academicBackground.additionalCertifications.map(
                      (cert, index) => (
                        <li
                          key={index}
                          className="text-gray-600 flex items-center gap-2 font-urbanist"
                        >
                          <Award className="w-4 h-4 text-[#FE2296]" />
                          {cert}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-[#111111] mb-6 font-montserrat flex items-center gap-2">
                <Award className="w-6 h-6 text-[#FE2296]" />
                Key Achievements
              </h3>
              <div className="grid gap-4">
                {tutor.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#477EFA] hover:shadow-lg transition-shadow"
                  >
                    <p className="text-gray-700 font-urbanist">{achievement}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-[#111111] mb-4 font-montserrat">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#477EFA]" />
                  <div>
                    <p className="font-semibold text-gray-800 font-montserrat">
                      Languages
                    </p>
                    <p className="text-gray-600 text-sm font-urbanist">
                      {tutor.languages.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#477EFA]" />
                  <div>
                    <p className="font-semibold text-gray-800 font-montserrat">
                      With NurtureNova
                    </p>
                    <p className="text-gray-600 text-sm font-urbanist">
                      {calculateNurtureNovaExperience(
                        tutor.nurtureNovaStartDate,
                        tutor.isActive
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-[#111111] mb-4 font-montserrat flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FE2296]" />
                Interests & Hobbies
              </h3>
              <div className="flex flex-wrap gap-2">
                {tutor.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-[#FE2296]/10 text-[#FE2296] px-3 py-1 rounded-full text-sm font-medium font-urbanist"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
