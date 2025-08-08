"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale, locales } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const languageNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

const languageFlags: Record<Locale, string> = {
  en: "🇺🇸",
  ar: "🇩🇿",
  fr: "🇫🇷",
};

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: Locale) => {
    startTransition(async () => {
      await setUserLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          disabled={isPending}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`flex items-center gap-2 ${
              locale === lang ? "bg-accent" : ""
            }`}
          >
            <span className="text-lg">{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
