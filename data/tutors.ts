export interface TutorDetail {
  id: string;
  name: string;
  position: string;
  nationality: string;
  gender: string;
  image: string;
  specialties: string[];
  nurtureNovaStartDate: string; // Format: "YYYY-MM-DD"
  isActive: boolean;
  bio: string;
  academicBackground: {
    degree: string;
    institution: string;
    year: string;
    additionalCertifications: string[];
  };
  interests: string[];
  achievements: string[];
  languages: string[];
}

export const tutorsData: TutorDetail[] = [
  {
    id: "rasheed-adeoti",
    name: "Rasheed Adeoti",
    position: "Founder",
    nationality: "Nigerian",
    gender: "Male",
    image: "/images/abdulrasheed.png",
    specialties: ["Mathematics"],

    nurtureNovaStartDate: "2025-03-01",
    isActive: true,
    bio: "Meet Our Founder – Rasheed Adeoti. \n\nRasheed Adeoti, Founder of NurtureNova Learning, has over 7 years’ experience teaching in traditional classrooms and 2 years in the online learning space. \n\n A First-Class Mathematics graduate and data scientist, Rasheed blends academic excellence with innovative technology to help students excel in both core subjects and future-ready skills. \n\n His passion for personalised, engaging learning is at the heart of NurtureNova’s mission — to empower every child to reach their full potential.",
    academicBackground: {
      degree: "Bachelor of Science in Mathematics",
      institution: "University of Ilorin, Nigeria",
      year: "2024",
      additionalCertifications: [
        "First class mathematics (BSc)",
        "Certified Online Tutor (COT)",
        "Advanced Mathematics Teaching Certificate",
      ],
    },
    interests: ["Teaching", "Reading"],

    achievements: [
      "MTN Foundation Scholar",
      "Successfully helped 95% of students improve their grades by at least one level",
      "Developed innovative teaching methods for online mathematics education",
    ],
    languages: ["English", "Yoruba", "Italian"],
  },
  {
    id: "toyeeb-olanrewaju-ambali",
    name: "Toyeeb Olanrewaju Ambali",
    position: "Mathematics and Web Development Tutor",
    nationality: "Nigerian",
    gender: "Male",
    image: "/images/toyyib.png",
    specialties: [
      "Mathematics",
      "Web Development",
     
    ],
    nurtureNovaStartDate: "2025-03-01",
    isActive: true,
    bio: "Toyeeb Olanrewaju Ambali is a versatile professional with a background in Electrical and Electronics Engineering and Network Engineering, bringing a few years of practical experience in the field. He has also developed expertise as a Data Entry Specialist, Brand/Graphics Designer, Researcher, and Developer, demonstrating strong analytical, technical, and problem-solving skills. \n\nIn addition to his engineering and technical background, he is passionate about teaching and tutoring, sharing knowledge across diverse areas of technology and education. With a growing interest in Cybersecurity, he continues to expand his skill set in safeguarding digital systems and networks. \n\nBeyond his professional pursuits, Toyeeb Olanrewaju Ambali is an enthusiastic sports lover, embracing discipline, teamwork, and resilience both on and off the field.",
    academicBackground: {
      degree:
        "Bachelor of Engineering in Electrical and Electronics Engineering",
      institution: "University of Ilorin, Nigeria",
      year: "2024",
      additionalCertifications: [
        "TESOL Certification",
        "Creative Writing Workshop Certificate",
        "Advanced Grammar and Composition",
      ],
    },
    interests: [
      "Creative Writing",
      "Poetry",
      "African Literature",
      "Storytelling",
      "Language Learning",
      "Cultural Studies",
    ],

    achievements: [
      "Helped students achieve top grades in GCSE English Literature",
      "Mentored young writers in national writing competitions",
      "Developed comprehensive curriculum for creative writing",
      "Featured speaker at education conferences",
    ],
    languages: ["English", "Yoruba", "French"],
  },
  {
    id: "rukayat-olabisi-lawal",
    name: "Rukayat Olabisi Lawal,",
    position: "Tutor and Administrator",
    nationality: "Nigerian",
    gender: "Female",
    image: "/images/olabisi.jpg",
    specialties: ["English Language", "Sciences"],
    nurtureNovaStartDate: "2025-03-01",
    isActive: true,
    bio: "I am Rukayat Olabisi Lawal, a graduate of the Federal University of Agriculture, Abeokuta (FUNAAB) where I studied Biological Sciences. I am an experienced teacher and tutor. Currently, I tutor learners at NurtureNova in English and Verbal Reasoning . \n\nI am committed to continuous professional growth and dedicated to making a lasting impact in the lives of my learners.",
    academicBackground: {
      degree: "Bachelor of Science",
      institution: "Federal University of Agriculture, Abeokuta, Nigeria",
      year: "NA",
      additionalCertifications: [
        "Bachelor of Science in Plant Biology",
        "Jobberman Soft Skills Certificate",
        "Alx professional development skill for digital age",
      ],
    },
    interests: ["Exploring", "Writing"],
    achievements: ["Bachelor's degree in Plant Biology"],
    languages: ["English"],
  },
  {
    id: "asima-michael-aquaowo",
    name: "Asima Michael Aquaowo",
    position: "English Tutor",
    nationality: "Nigerian",
    gender: "Female",
    image: "images/asima.jpg",
    specialties: ["English Language", "Biology"],

    nurtureNovaStartDate: "2025-10-13",
    isActive: true,
    bio: "Asima Michael Aquaowo is a passionate and dedicated educator from Nigeria, specialising in English and Biology. She holds a BSc in Medical Laboratory Science and brings two years of teaching experience to her role.\n\nAsima joined NurtureNova Learning in October 2025, where she is committed to creating engaging, student-centred learning experiences that help learners build confidence and achieve academic excellence.\n\nBeyond the classroom, Asima enjoys writing, a passion that enriches her teaching style and inspires her students to express themselves effectively.\n\nShe is fluent in English and believes strongly in the power of education to transform lives.",
    academicBackground: {
      degree: "Bachelor of Science in Medical Laboratory Science",
      institution: "Niger Delta University, Nigeria",
      year: "2022",
      additionalCertifications: ["NA"],
    },
    interests: ["Writing and Literature"],

    achievements: ["Attaining Bachelor's of science degree"],
    languages: ["English"],
  },
  {
    id: "murtala-muhammmad-munabau",
    name: "Murtala Muhammad Munabau",
    position: "Graphic Designer",
    nationality: "Nigerian",
    gender: "Male",
    image: "images/munabau.jpg",
    specialties: [
      "Mathematics",
      "Graphic Design",
      "UI/UX Design",
      "Digital Art",
    ],

    nurtureNovaStartDate: "2025-03-01",
    isActive: true,
    bio: "A passionate and creative Graphic Designer with over 3 years of experience in creating visual solutions that communicate clearly and leave lasting impressions. \n\nAt NutureNova Learning, He focus on creating solution-driven visual content that aligns with the brand's goal and resonates with its audience.",
    academicBackground: {
      degree: "Bachelor of Science in Mathematics",
      institution: "University of Ilorin, Nigeria",
      year: "2025",
      additionalCertifications: [
        "Certified Graphic Designer (CGD)",
     
      ],
    },
    interests: ["Designing", "Creative Art"],

    achievements: ["N/A"],
    languages: ["English", "Yoruba"],
  },
  {
    id: "yusuf-abdullahi-temidayo",
    name: "Yusuf Abdullahi Temidayo",
    position: "Frontend Developer & Instructor",
    nationality: "Nigerian",
    gender: "Male",
    image: "/images/yusasive.png",
    specialties: [
      "Software Development",
      "FullStack Development",
      "Frontend Development",
      "Frontend Instructor",
    ],

    nurtureNovaStartDate: "2025-03-01",
    isActive: true,
    bio: "Yuusuf Abdullahi Temidayo (Yusasive) is a Full-Stack Engineer and Frontend Developer with expertise in React, React Native,  Next.js, TypeScript, Tailwind CSS, Flutter, REST APIs, NodeJs Django and the MEAN stack. \n\nAt NurtureNova Learning, he serves as both a Frontend Engineer and Instructor, building responsive, performance-driven applications while also guiding teenagers worldwide through structured, hands-on web development lessons. \n\nWith a Mathematics degree from the University of Ilorin and experience training youths through programs like Cypherdevs (with the Federal Ministry of Education & World Bank), he combines technical excellence with a passion for teaching and mentorship",
    academicBackground: {
      degree: "Bachelor of Science in Mathematics",
      institution: "University of Ilorin, Nigeria",
      year: "2025",
      additionalCertifications: [
        "Meta software development certificate",
        "Freecodecamp Fullstack development dertificate",
        "MALhub MERN STack development certificate",
      ],
    },
    interests: ["Touring", "Exploring New Tecnhologies", "Travelling"],

    achievements: [
      "Mentored 150+ youths in tech skills",
      "Won several awards in hackathons and coding competitions",
      "Gained recognition as innovator of the year, Unilorin 2025",
      "Gained Online visibility as a Software Developer",
    ],
    languages: ["English", "Yoruba", "Arabic"],
  },
];

// Utility function to calculate experience with NurtureNova
export function calculateNurtureNovaExperience(
  startDate: string,
  isActive: boolean
): string {
  if (!isActive) {
    return "Former Team Member";
  }

  const start = new Date(startDate);
  const now = new Date();

  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0) {
    if (months > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
    }
    return `${years} year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    return "Less than 1 month";
  }
}

// Get only active tutors
export function getActiveTutors(): TutorDetail[] {
  return tutorsData.filter((tutor) => tutor.isActive);
}

// Get tutor by ID
export function getTutorById(id: string): TutorDetail | undefined {
  return tutorsData.find((tutor) => tutor.id === id);
}

// Get tutors by specialty
export function getTutorsBySpecialty(specialty: string): TutorDetail[] {
  return tutorsData.filter(
    (tutor) =>
      tutor.isActive &&
      tutor.specialties.some((s) =>
        s.toLowerCase().includes(specialty.toLowerCase())
      )
  );
}
