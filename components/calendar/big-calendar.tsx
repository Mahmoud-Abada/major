"use client";

import { useCalendarContext } from "@/components/calendar/event-calendar/calendar-context";
import { getDay } from "date-fns";
import { useMemo, useState } from "react";

import { EventCalendar } from "@/components/calendar/event-calendar/event-calendar";
import type {
  CalendarEvent,
  EventColor,
} from "@/components/calendar/event-calendar/types";

import { useTranslations } from "next-intl";

// Etiquettes data for calendar filtering - will be translated
export const getEtiquettes = (t: (key: string) => string) => {
  return [
    {
      id: "my-events",
      name: t("myEvents") || "My Events",
      color: "emerald" as EventColor,
      isActive: true,
    },
    {
      id: "marketing-team",
      name: t("marketingTeam") || "Marketing Team",
      color: "orange" as EventColor,
      isActive: true,
    },
    {
      id: "interviews",
      name: t("interviews") || "Interviews",
      color: "violet" as EventColor,
      isActive: true,
    },
    {
      id: "events-planning",
      name: t("eventsPlanning") || "Events Planning",
      color: "blue" as EventColor,
      isActive: true,
    },
    {
      id: "holidays",
      name: t("holidays") || "Holidays",
      color: "rose" as EventColor,
      isActive: true,
    },
  ];
};

// Function to calculate days until next Sunday
const getDaysUntilNextSunday = (date: Date) => {
  const day = getDay(date); // 0 is Sunday, 6 is Saturday
  return day === 0 ? 0 : 7 - day; // If today is Sunday, return 0, otherwise calculate days until Sunday
};

// Store the current date to avoid repeated new Date() calls
const currentDate = new Date();

// Calculate the offset once to avoid repeated calculations
const daysUntilNextSunday = getDaysUntilNextSunday(currentDate);

// Empty events array - will be populated from API
const sampleEvents: CalendarEvent[] = [];

export default function Component() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const { isColorVisible } = useCalendarContext();
  const t = useTranslations("calendar");

  // Use the regular function with translations
  const etiquettes = useMemo(() => getEtiquettes(t), [t]);

  // Filter events based on visible colors
  const visibleEvents = useMemo(() => {
    return events.filter((event) => isColorVisible(event.color));
  }, [events, isColorVisible]);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <EventCalendar
      events={visibleEvents}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="week"
    />
  );
}
