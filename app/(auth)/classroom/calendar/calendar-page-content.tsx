"use client";

import BigCalendar from "@/components/calendar/big-calendar";
import { CalendarSidebarContent } from "@/components/calendar/calendar-sidebar-content";
import { useTranslations } from "next-intl";

function CalendarOptionsToggle() {
  const t = useTranslations("calendar");

  return (
    <div className="lg:hidden mb-4">
      <details className="group">
        <summary className="flex items-center justify-between p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
          <span className="font-medium text-sm md:text-base">
            {t("calendarOptions")}
          </span>
          <svg
            className="w-4 h-4 md:w-5 md:h-5 transition-transform group-open:rotate-180 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div className="mt-2 p-3 md:p-4 bg-card border rounded-lg shadow-sm">
          <CalendarSidebarContent />
        </div>
      </details>
    </div>
  );
}

export function CalendarPageContent() {
  return (
    <div className="flex flex-1 gap-2 md:gap-4 p-2 md:p-4 min-h-0">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 xl:w-80 shrink-0">
        <div className="sticky top-4 bg-card border rounded-lg p-4 shadow-sm">
          <CalendarSidebarContent />
        </div>
      </div>

      {/* Main Calendar Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Calendar Sidebar - Collapsible */}
        <CalendarOptionsToggle />

        {/* Calendar Component */}
        <div className="flex-1 min-h-0">
          <BigCalendar />
        </div>
      </div>
    </div>
  );
}
