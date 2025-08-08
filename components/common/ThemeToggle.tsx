"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  const themes = [
    {
      value: "light",
      label: t("theme.light"),
      icon: Sun,
      description: t("theme.lightDescription"),
    },
    {
      value: "dark",
      label: t("theme.dark"),
      icon: Moon,
      description: t("theme.darkDescription"),
    },
    {
      value: "system",
      label: t("theme.system"),
      icon: Monitor,
      description: t("theme.systemDescription"),
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Palette;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={t("theme.toggleTheme")}
        >
          <div className="transition-transform duration-200 hover:scale-110">
            <CurrentIcon className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" sideOffset={4}>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;

          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <div
                className={`transition-all duration-200 ${
                  isSelected
                    ? "scale-110 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4 mt-0.5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{themeOption.label}</div>
                <div className="text-xs text-muted-foreground">
                  {themeOption.description}
                </div>
              </div>
              {isSelected && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
