"use client";

import {
  Bookmark,
  Calendar,
  CreditCard,
  icons,
  LayoutDashboard,
  ListChecks,
  Plus,
  School,
  Settings,
  Tickets,
  Users,
} from "lucide-react";
import SecondarySidebar from "../common/SecondarySidebar";
import Discussion from "../inbox/Discussion";
import InboxTopbar from "../inbox/InboxTopbar";
import MessagesList from "../inbox/MessagesList";

const ClassroomPage = () => {
  const sidebarItems = [
    { name: "All Projects", icon: Bookmark, count: 5, active: true },
    { name: "Calendar", icon: Calendar, count: null },
    { name: "Settings", icon: Settings, count: null },
  ];

  const sections = [
    {
      key: "quickActions",
      title: "Quick Actions",
      initiallyExpanded: true,
      items: [
        { name: "Payments", icon: CreditCard },
        { name: "Create", icon: Plus },
        { name: "Students", icon: Users },
      ],
    },
    {
      key: "managment",
      title: "Management",
      initiallyExpanded: true,
      items: [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Staff", icon: Users },
      ],
    },
    {
      key: "home",
      title: "Home",
      initiallyExpanded: true,
      items: [
        { name: "Classes", icon: LayoutDashboard },
        { name: "Groups", icon: Users },
        { name: "Events", icon: Tickets },
        { name: "Attendance", icon: ListChecks },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden text-white">
      <SecondarySidebar mainItems={sidebarItems} sections={sections} />
      <div className="flex flex-col flex-1 min-w-0">
        <InboxTopbar />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r border-neutral-800 overflow-y-auto">
            <MessagesList />
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            <Discussion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
