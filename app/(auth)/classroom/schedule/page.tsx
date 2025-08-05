import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Schedule - Classroom",
};

import ScheduleContent from "@/components/classroom/schedule/schedule-content";

export default function SchedulePage() {
    return <ScheduleContent />;
}