"use client";
import * as React from "react";
import { SearchForm } from "@/components/search-form";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  RiBuildingLine,
  RiBookLine,
  RiGroupLine,
  RiUserLine,
  RiTeamLine,
  RiNotificationLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiTestTubeLine,
  RiUserFollowLine,
  RiPencilLine,
  RiTimeLine,
  RiMailLine,
  RiBookOpenLine,
  RiDashboardLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import Link from "next/link";

const data = {
  teams: [
    {
      name: "Springfield High",
      logo: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/logo-01_kp2j8x.png",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: RiDashboardLine,
    },
    {
      title: "Classroom",
      icon: RiBuildingLine,
      subcategories: [
        {
          title: "Overview",
          url: "/classroom/overview",
          icon: RiDashboardLine,
        },
        {
          title: "Classes",
          url: "/classroom/classes",
          icon: RiBookLine,
        },
        {
          title: "Students",
          url: "/classroom/students",
          icon: RiUserLine,
        },
        {
          title: "Groups",
          url: "/classroom/groups",
          icon: RiGroupLine,
        },
        {
          title: "Teachers",
          url: "/classroom/teachers",
          icon: RiTeamLine,
        },
        {
          title: "Posts",
          url: "/classroom/posts",
          icon: RiNotificationLine,
        },
        {
          title: "Events",
          url: "/classroom/events",
          icon: RiCalendarLine,
        },
      ],
    },
    {
      title: "Management",
      icon: RiBookLine,
      subcategories: [
        {
          title: "Payments",
          url: "/management/payments",
          icon: RiMoneyDollarCircleLine,
        },
        {
          title: "Marks",
          url: "/management/marks",
          icon: RiTestTubeLine,
        },
        {
          title: "Attendance",
          url: "/management/attendance",
          icon: RiUserFollowLine,
        },
        {
          title: "Homeworks",
          url: "/management/homeworks",
          icon: RiPencilLine,
        },
        {
          title: "Schedule",
          url: "/management/schedule",
          icon: RiTimeLine,
        },
      ],
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: RiMailLine,
    },
    {
      title: "Learning",
      icon: RiBookOpenLine,
      subcategories: [
        {
          title: "Courses",
          url: "/learning/courses",
          icon: RiBookLine,
        },
        {
          title: "Resources",
          url: "/learning/resources",
          icon: RiBookLine,
        },
        {
          title: "Assignments",
          url: "/learning/assignments",
          icon: RiPencilLine,
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: RiSettings3Line,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [expandedGroups, setExpandedGroups] = React.useState<
    Record<string, boolean>
  >({
    Classroom: false,
    Management: false,
    Learning: false,
  });

  const [currentPath, setCurrentPath] = React.useState("/dashboard");

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (url: string) => currentPath === url;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <hr className="border-t border-border mx-2 -mt-px" />
        <SearchForm className="mt-3" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-1">
          {data.navMain.map((item) => (
            <React.Fragment key={item.title}>
              {item.subcategories ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleGroup(item.title)}
                      className={`group/menu-button w-full flex items-center gap-3 h-9 px-3 rounded-md transition-colors
                        ${isActive(item?.url) ? "bg-primary/10 text-primary" : "hover:bg-accent/50"}`}
                    >
                      {item.icon && (
                        <item.icon
                          className={`shrink-0 ${isActive(item.url) ? "text-primary" : "text-muted-foreground/70"}`}
                          size={20}
                        />
                      )}
                      <span className="flex-1 text-left text-sm font-medium">
                        {item.title}
                      </span>
                      {expandedGroups[item.title] ? (
                        <RiArrowDownSLine
                          className="text-muted-foreground/60"
                          size={16}
                        />
                      ) : (
                        <RiArrowRightSLine
                          className="text-muted-foreground/60"
                          size={16}
                        />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {expandedGroups[item.title] && (
                    <div className="ml-8 space-y-1">
                      {item.subcategories.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild
                            className={`group/menu-button w-full flex items-center gap-3 h-8 px-3 rounded-md text-sm transition-colors
                              ${isActive(subItem.url) ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/30 text-muted-foreground"}`}
                          >
                            <a
                              href={subItem.url}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPath(subItem.url);
                                // In a real app, you would navigate here
                              }}
                            >
                              {subItem.icon && (
                                <subItem.icon
                                  className={`shrink-0 ${isActive(subItem.url) ? "text-primary" : "text-muted-foreground/60"}`}
                                  size={18}
                                />
                              )}
                              <span>{subItem.title}</span>
                            </a>
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
                    className={`group/menu-button w-full flex items-center gap-3 h-9 px-3 rounded-md transition-colors
                      ${isActive(item.url) ? "bg-primary/10 text-primary" : "hover:bg-accent/50"}`}
                  >
                    <Link
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPath(item.url);
                        // In a real app, you would navigate here
                      }}
                    >
                      {item.icon && (
                        <item.icon
                          className={`shrink-0 ${isActive(item.url) ? "text-primary" : "text-muted-foreground/70"}`}
                          size={20}
                        />
                      )}
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group/menu-button w-full flex items-center gap-3 h-9 px-3 rounded-md hover:bg-accent/50"
            >
              <a href="/logout">
                <RiLogoutBoxLine
                  className="text-muted-foreground/70"
                  size={20}
                />
                <span className="text-sm font-medium">Sign Out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
