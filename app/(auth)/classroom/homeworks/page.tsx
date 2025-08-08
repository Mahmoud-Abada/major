import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeworks - Classroom",
};

import HomeworksContent from "@/components/classroom/homeworks/homeworks-content";

export default function HomeworksPage() {
  return <HomeworksContent />;
}
