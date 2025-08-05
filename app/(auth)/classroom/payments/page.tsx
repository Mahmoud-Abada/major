import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payments - Classroom",
};

import PaymentsContent from "@/components/classroom/payments/payments-content";

export default function PaymentsPage() {
    return <PaymentsContent />;
}