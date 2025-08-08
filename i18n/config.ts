// i18n/config.ts
export const locales = ["en", "fr", "ar"] as const;
export const defaultLocale = "ar" satisfies Locale;
export type Locale = (typeof locales)[number];
