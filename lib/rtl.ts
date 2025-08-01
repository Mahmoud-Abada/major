export type Locale = 'en' | 'fr' | 'ar';

// Simple RTL check
export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

// Apply RTL to document
export function applyRTL(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }
}