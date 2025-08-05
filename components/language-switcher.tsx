"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale } from "@/i18n/config";
import { Check, Globe } from "lucide-react";
// Mock i18n functions since the module doesn't exist
const useI18n = () => ({ 
  locale: 'en',
  setLocale: (locale: string) => console.log('Setting locale:', locale),
  t: (key: string) => key
});
const getAvailableLocales = () => [
  { value: 'en', label: 'English', nativeName: 'English' },
  { value: 'fr', label: 'Français', nativeName: 'Français' },
  { value: 'ar', label: 'العربية', nativeName: 'العربية' }
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const availableLocales = getAvailableLocales();

  const currentLocale = availableLocales.find((l) => l.value === locale);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={t("language.switchLanguage")}
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {currentLocale?.nativeName || locale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48"
        sideOffset={4}
      >
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
          {t("language.selectLanguage")}
        </div>
        {availableLocales.map((localeOption) => {
          const isSelected = locale === localeOption.value;

          return (
            <DropdownMenuItem
              key={localeOption.value}
              onClick={() => handleLocaleChange(localeOption.value as Locale)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <div className="flex-1">
                <div className="font-medium">{localeOption.nativeName}</div>
                <div className="text-xs text-muted-foreground">
                  {localeOption.label}
                </div>
              </div>
              {isSelected && (
                <div className="transition-all duration-200 animate-in fade-in-0 zoom-in-95">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
