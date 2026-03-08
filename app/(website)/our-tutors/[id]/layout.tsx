import React from "react";
import { tutorsData } from "@/data/tutors";

// Pre-generate all dynamic paths for static export
export async function generateStaticParams() {
  return tutorsData.map((tutor) => ({ id: tutor.id }));
}

// Optional: ensure unknown params return 404 at build/export time
export const dynamicParams = false;

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
