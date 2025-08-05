"use client";
import { SearchForm } from "@/components/search-form";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiBookLine,
  RiBookOpenLine,
  RiBuildingLine,
  RiCalendarEventLine,
  RiCalendarLine,
  RiDashboardLine,
  RiGroupLine,
  RiLogoutBoxLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiNotificationLine,
  RiParentLine,
  RiPencilLine,
  RiSchoolLine,
  RiSettings3Line,
  RiTeamLine,
  RiTestTubeLine,
  RiTimeLine,
  RiUserFollowLine,
  RiUserLine
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('sidebar');
  const [expandedGroups, setExpandedGroups] = React.useState<
    Record<string, boolean>
  >({
    Classroom: false,
    Management: false,
    Learning: false,
  });

  const data = {
    teams: [
      {
        name: "Springfield High",
        logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png",
      },
    ],
    navMain: [
      {
        title: t('dashboard'),
        url: "/dashboard",
        icon: RiDashboardLine,
      },
      {
        title: t('classroom'),
        icon: RiBuildingLine,
        subcategories: [
          {
            title: t('statistics'),
            url: "/classroom/statistics",
            icon: RiDashboardLine,
          },
          {
            title: t('classes'),
            url: "/classroom/classes",
            icon: RiBookLine,
          },
          {
            title: t('groups'),
            url: "/classroom/groups",
            icon: RiGroupLine,
          },
          {
            title: t('students'),
            url: "/classroom/students",
            icon: RiUserLine,
          },
          {
            title: t('teachers'),
            url: "/classroom/teachers",
            icon: RiTeamLine,
          },
          {
            title: t('posts'),
            url: "/classroom/posts",
            icon: RiNotificationLine,
          },
          {
            title: t('events'),
            url: "/classroom/events",
            icon: RiCalendarEventLine,
          },
          {
            title: t('calendar'),
            url: "/classroom/calendar",
            icon: RiCalendarLine,
          },
          {
            title: t('schools'),
            url: "/classroom/schools",
            icon: RiSchoolLine,
          },
          {
            title: t('parents'),
            url: "/classroom/parents",
            icon: RiParentLine,
          },
          {
            title: t('payments'),
            url: "/classroom/payments",
            icon: RiMoneyDollarCircleLine,
          },
        ],
      },
      {
        title: t('management'),
        icon: RiBookLine,
        subcategories: [
          {
            title: t('marks'),
            url: "/classroom/marks",
            icon: RiTestTubeLine,
          },
          {
            title: t('attendance'),
            url: "/classroom/attendance",
            icon: RiUserFollowLine,
          },
          {
            title: t('homeworks'),
            url: "/classroom/homeworks",
            icon: RiPencilLine,
          },
          {
            title: t('schedule'),
            url: "/classroom/schedule",
            icon: RiTimeLine,
          },
        ],
      },
      {
        title: t('inbox'),
        url: "/inbox",
        icon: RiMailLine,
      },
      {
        title: t('learning'),
        icon: RiBookOpenLine,
        subcategories: [
          {
            title: t('courses'),
            url: "/learning/courses",
            icon: RiBookLine,
          },
          {
            title: t('resources'),
            url: "/learning/resources",
            icon: RiBookLine,
          },
          {
            title: t('assignments'),
            url: "/learning/assignments",
            icon: RiPencilLine,
          },
        ],
      },
      {
        title: t('settings'),
        url: "/settings",
        icon: RiSettings3Line,
      },
    ],
  };

  const currentPath = usePathname();

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (url?: string) => url && currentPath === url;

  return (
    <Sidebar {...props} className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 pb-4">
        <TeamSwitcher teams={data.teams} />
        <hr className="border-t border-border mx-2 -mt-px" />
        <SearchForm className="mt-3" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu className="space-y-1">
          {data.navMain.map((item) => (
            <React.Fragment key={item.title}>
              {item.subcategories ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(item.title)}
                      className={`group/menu-button w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50 ${isActive(item.url) ? "bg-primary/10 text-primary" : ""
                        }`}
                    >
                      {item.icon && (
                        <item.icon
                          className={`shrink-0 transition-colors ${isActive(item.url) ? "text-primary" : "text-muted-foreground/70"
                            }`}
                          size={20}
                        />
                      )}
                      <span className="flex-1 text-left text-sm font-medium truncate">
                        {item.title}
                      </span>
                      {expandedGroups[item.title] ? (
                        <RiArrowDownSLine
                          className="text-muted-foreground/60 transition-transform"
                          size={16}
                        />
                      ) : (
                        <RiArrowRightSLine
                          className="text-muted-foreground/60 transition-transform"
                          size={16}
                        />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {expandedGroups[item.title] && (
                    <div className="ml-6 space-y-1 border-l border-border/30 pl-4">
                      {item.subcategories.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild
                            className={`group/menu-button w-full flex items-center gap-3 h-9 px-3 rounded-lg text-sm transition-all duration-200 ${isActive(subItem.url)
                                ? "bg-primary/10 text-primary font-medium shadow-sm"
                                : "hover:bg-accent/30 text-muted-foreground hover:text-foreground"
                              }`}
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon
                                  className={`shrink-0 transition-colors ${isActive(subItem.url) ? "text-primary" : "text-muted-foreground/60"
                                    }`}
                                  size={18}
                                />
                              )}
                              <span className="truncate">{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`group/menu-button w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-all duration-200 ${isActive(item.url)
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "hover:bg-accent/50 hover:text-foreground"
                      }`}
                  >
                    <Link href={item.url || "#"}>
                      {item.icon && (
                        <item.icon
                          className={`shrink-0 transition-colors ${isActive(item.url) ? "text-primary" : "text-muted-foreground/70"
                            }`}
                          size={20}
                        />
                      )}
                      <span className="text-sm font-medium truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group/menu-button w-full flex items-center gap-3 h-10 px-3 rounded-lg hover:bg-accent/50 transition-all duration-200"
            >
              <Link href="/logout">
                <RiLogoutBoxLine
                  className="text-muted-foreground/70 transition-colors group-hover/menu-button:text-foreground"
                  size={20}
                />
                <span className="text-sm font-medium">{t('signOut')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}