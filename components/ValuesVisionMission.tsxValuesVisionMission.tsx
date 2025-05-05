export default function ValuesVisionMission() {
  return (
    <section className="bg-[#477EFA] pt-32 text-white px-4 py-16 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#FFFFFF] mb-4">
            Our Values
          </h2>
          <p className="text-white text-xl font-mont font-medium mb-6 leading-relaxed">
            At NurtureNova Learning, our core values shape everything we do.
            They guide how we teach, how we support, and how we grow together.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "Servant Leadership",
              "Clear and Open Communication",
              "Respect and Relationship",
              "Integrity",
              "Growth and Development",
              "Celebration",
              "Welfare and Support",
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white text-[#477EFA] px-4 py-2 rounded-lg shadow text-sm font-montserrat font-medium"
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white text-black p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-[#FE2296] font-montserrat mb-2">
              Our Vision
            </h3>
            <p className="text-gray-700 text-base font-medium font-montserrat">
              Our vision is to become the leading online tutoring company,
              recognised for our dedication to staff growth and welfare,
              personalised education, and empowering students to achieve success
              across global communities.
            </p>
          </div>

          <div className="bg-white text-black p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold font-montserrat text-[#FE2296] mb-2">
              Our Mission
            </h3>
            <p className="text-gray-700 text-base font-medium font-montserrat">
              Our mission is to equip students with a strong academic foundation
              and a genuine love for learning. We aim to deliver impactful
              programmes that foster both academic excellence and character
              development, while embracing personalised learning approaches that
              enhance each student&apos;s growth and success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
