"use client";

import { Search, Plus, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("Dashboard.header");

  return (
    <header className="flex items-center justify-between p-4 border-b h-16 shrink-0">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t("searchPlaceholder")} className="pl-10" />
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline">
          <CreditCard className="h-4 w-4 mr-2" />
          {t("enterPayment")}
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("create")}
        </Button>
      </div>
    </header>
  );
}
