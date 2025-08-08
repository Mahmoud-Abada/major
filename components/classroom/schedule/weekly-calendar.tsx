"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiMapPinLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import { useState } from "react";
import type { ScheduleEntry } from "./types";

interface WeeklyCalendarProps {
  entries: ScheduleEntry[];
  onEntryClick: (entry: ScheduleEntry) => void;
  onEntryEdit: (entry: ScheduleEntry) => void;
}

const daysOfWeek = [
  { key: "monday", label: "Lundi", short: "Lun" },
  { key: "tuesday", label: "Mardi", short: "Mar" },
  { key: "wednesday", label: "Mercredi", short: "Mer" },
  { key: "thursday", label: "Jeudi", short: "Jeu" },
  { key: "friday", label: "Vendredi", short: "Ven" },
  { key: "saturday", label: "Samedi", short: "Sam" },
];

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export function WeeklyCalendar({
  entries,
  onEntryClick,
  onEntryEdit,
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getEntriesForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return entries.filter((entry) => entry.date === dateStr);
  };

  const getEntryPosition = (entry: ScheduleEntry) => {
    const startTime = entry.startTime;
    const endTime = entry.endTime;

    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    const startPosition = ((startHour - 8) * 60 + startMinute) / 30; // 30-minute slots starting from 8:00
    const duration =
      ((endHour - startHour) * 60 + (endMinute - startMinute)) / 30;

    return {
      top: `${startPosition * 2.5}rem`, // 2.5rem per 30-minute slot
      height: `${duration * 2.5}rem`,
    };
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[5];
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RiCalendarLine className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{formatWeekRange()}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("prev")}
          >
            <RiArrowLeftLine size={16} />
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(new Date())}
          >
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek("next")}
          >
            Suivant
            <RiArrowRightLine size={16} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-muted/50">
          <div className="p-3 border-r text-sm font-medium text-center">
            Heure
          </div>
          {daysOfWeek.map((day, index) => (
            <div
              key={day.key}
              className="p-3 border-r last:border-r-0 text-center"
            >
              <div className="text-sm font-medium">{day.label}</div>
              <div className="text-xs text-muted-foreground">
                {weekDates[index]?.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {/* Time Column */}
          <div className="border-r bg-muted/20">
            {timeSlots
              .filter((_, index) => index % 2 === 0)
              .map((time) => (
                <div
                  key={time}
                  className="h-20 border-b flex items-center justify-center text-xs text-muted-foreground"
                >
                  {time}
                </div>
              ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="border-r last:border-r-0 relative">
              {/* Time Slot Grid */}
              {timeSlots
                .filter((_, index) => index % 2 === 0)
                .map((time, slotIndex) => (
                  <div key={time} className="h-20 border-b border-muted/30" />
                ))}

              {/* Entries */}
              <div className="absolute inset-0 p-1">
                {getEntriesForDay(date).map((entry) => {
                  const position = getEntryPosition(entry);
                  return (
                    <Card
                      key={entry.id}
                      className="absolute left-1 right-1 cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        top: position.top,
                        height: position.height,
                        backgroundColor: entry.color || "#3B82F6",
                        borderColor: entry.color || "#3B82F6",
                        minHeight: "2.5rem",
                      }}
                      onClick={() => onEntryClick(entry)}
                    >
                      <CardContent className="p-2 text-white text-xs">
                        <div className="font-medium truncate">
                          {entry.title}
                        </div>
                        <div className="flex items-center gap-1 mt-1 opacity-90">
                          <RiTimeLine size={12} />
                          <span>
                            {entry.startTime}-{entry.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-90">
                          <RiUserLine size={12} />
                          <span className="truncate">{entry.teacherName}</span>
                        </div>
                        {entry.roomName && (
                          <div className="flex items-center gap-1 opacity-90">
                            <RiMapPinLine size={12} />
                            <span className="truncate">{entry.roomName}</span>
                          </div>
                        )}
                        <Badge
                          variant="secondary"
                          className="mt-1 text-xs bg-white/20 text-white border-white/30"
                        >
                          {entry.className}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Cours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>TP/TD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Examen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Réunion</span>
        </div>
      </div>
    </div>
  );
}
