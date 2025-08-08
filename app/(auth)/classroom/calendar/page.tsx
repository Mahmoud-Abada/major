import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CalendarPageContent } from "./calendar-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calendar");
  return {
    title: `${t("title")} - Classroom`,
  };
}

export default function Page() {
  return <CalendarPageContent />;
}
