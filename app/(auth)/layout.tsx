import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("navigation");
  return {
    title: `${t("dashboard")} - MAJOR Academy`,
  };
}

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthLayoutContent } from "./auth-layout-content";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <AuthLayoutContent>{children}</AuthLayoutContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
