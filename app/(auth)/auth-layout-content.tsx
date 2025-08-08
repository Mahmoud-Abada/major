"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import FeedbackDialog from "@/components/feedback-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";
import { RiScanLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CalendarProvider } from "../../components/calendar/event-calendar/calendar-context";

interface Props {
  children: React.ReactNode;
}

export function AuthLayoutContent({ children }: Props) {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  // Extract current page from pathname for breadcrumb
  const getCurrentPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Map common routes to translations
    const routeMap: Record<string, string> = {
      dashboard: t("dashboard"),
      students: t("students"),
      teachers: t("teachers"),
      classes: t("classes"),
      calendar: t("calendar"),
      posts: t("posts"),
      attendance: t("attendance"),
      homeworks: t("homeworks"),
      schedule: t("schedule"),
      marks: t("marks"),
      payments: t("payments"),
      statistics: t("statistics"),
      groups: t("groups"),
      events: t("events"),
      schools: t("schools"),
      parents: t("parents"),
    };

    return routeMap[lastSegment] || lastSegment;
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="flex flex-col h-full">
        <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b border-border/40 px-3 md:px-6">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger className="-ms-1 md:-ms-2" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className="hidden sm:flex">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/dashboard"
                    className="flex items-center gap-2"
                  >
                    <RiScanLine size={18} aria-hidden="true" />
                    <span className="sr-only">{t("dashboard")}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-sm md:text-base">
                    {getCurrentPageTitle()}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:block">
              <FeedbackDialog />
            </div>
            <UserDropdown />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <CalendarProvider>
            <div className="h-full">{children}</div>
          </CalendarProvider>
        </main>
      </div>
    </ProtectedRoute>
  );
}
