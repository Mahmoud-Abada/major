"use client";

import { etiquettes } from "@/components/calendar/big-calendar";
import { useCalendarContext } from "@/components/calendar/event-calendar/calendar-context";
import SidebarCalendar from "@/components/calendar/sidebar-calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { RiCheckLine } from "@remixicon/react";

interface CalendarSidebarContentProps {
    className?: string;
}

export function CalendarSidebarContent({ className }: CalendarSidebarContentProps) {
    const { isColorVisible, toggleColorVisibility } = useCalendarContext();

    return (
        <div className={cn("space-y-6", className)}>
            {/* Mini Calendar */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Calendar</h3>
                <SidebarCalendar />
            </div>

            {/* Calendar Filters */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground uppercase text-muted-foreground/65">
                    Calendars
                </h3>
                <div className="space-y-2">
                    {etiquettes.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Checkbox
                                    id={item.id}
                                    className="sr-only peer"
                                    checked={isColorVisible(item.color)}
                                    onCheckedChange={() => toggleColorVisibility(item.color)}
                                />
                                <RiCheckLine
                                    className="peer-not-data-[state=checked]:invisible text-muted-foreground"
                                    size={16}
                                    aria-hidden="true"
                                />
                                <label
                                    htmlFor={item.id}
                                    className={cn(
                                        "text-sm font-medium cursor-pointer flex-1 transition-colors",
                                        !isColorVisible(item.color) && "line-through text-muted-foreground/65"
                                    )}
                                >
                                    {item.name}
                                </label>
                            </div>
                            <span
                                className="size-3 rounded-full shrink-0"
                                style={{
                                    backgroundColor: `var(--color-${item.color}-400)`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}