export const supportedLanguages = ["ar", "en", "fr"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export const defaultLanguage: SupportedLanguage = "ar";

export const getOptions = (
  lang: string = defaultLanguage,
  ns: string | string[] = "common",
) => ({
  supportedLngs: supportedLanguages,
  fallbackLng: defaultLanguage,
  lng: lang,
  fallbackNS: "common",
  defaultNS: "common",
  ns,
  load: "currentOnly" as const,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});
