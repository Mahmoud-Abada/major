# Internationalization (i18n)

## Overview

The application supports multiple languages with full internationalization using `next-intl`, including right-to-left (RTL) layout support for Arabic.

## Supported Languages

- **English (en)**: Default language, left-to-right
- **French (fr)**: Left-to-right
- **Arabic (ar)**: Right-to-left with custom font support

## Configuration

### Locale Configuration
```typescript
// config.ts
export const locales = ["en", "fr", "ar"] as const;
export const defaultLocale: (typeof locales)[0] = "en";
export const COOKIE_NAME = "NEXT_LOCALE";
```

### Next.js Integration
```typescript
// next.config.ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const config: NextConfig = {};

export default withNextIntl(config);
```

### i18n Request Configuration
```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from '@/config';

export default getRequestConfig(async () => {
  // Get locale from cookie or use default
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;

  // Validate locale
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
```

## Translation Files

### English (messages/en.json)
```json
{
  "common": {
    "welcome": "Welcome, {name}!",
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "filter": "Filter",
    "actions": "Actions"
  },
  "auth": {
    "signin": "Sign In",
    "signup": "Sign Up",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "forgotPassword": "Forgot Password?",
    "rememberMe": "Remember me",
    "signinSuccess": "Signed in successfully",
    "signupSuccess": "Account created successfully",
    "invalidCredentials": "Invalid email or password"
  },
  "classroom": {
    "dashboard": "Dashboard",
    "classes": "Classes",
    "students": "Students",
    "teachers": "Teachers",
    "attendance": "Attendance",
    "grades": "Grades",
    "schedule": "Schedule",
    "createClassroom": "Create Classroom",
    "classroomName": "Classroom Name",
    "description": "Description",
    "capacity": "Capacity",
    "subject": "Subject"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "classroom": "Classroom",
    "inbox": "Inbox",
    "profile": "Profile",
    "settings": "Settings"
  }
}
```

### French (messages/fr.json)
```json
{
  "common": {
    "welcome": "Bienvenue, {name}!",
    "loading": "Chargement...",
    "error": "Une erreur s'est produite",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer",
    "search": "Rechercher",
    "filter": "Filtrer",
    "actions": "Actions"
  },
  "auth": {
    "signin": "Se connecter",
    "signup": "S'inscrire",
    "logout": "Se déconnecter",
    "email": "Email",
    "password": "Mot de passe",
    "confirmPassword": "Confirmer le mot de passe",
    "forgotPassword": "Mot de passe oublié?",
    "rememberMe": "Se souvenir de moi",
    "signinSuccess": "Connexion réussie",
    "signupSuccess": "Compte créé avec succès",
    "invalidCredentials": "Email ou mot de passe invalide"
  },
  "classroom": {
    "dashboard": "Tableau de bord",
    "classes": "Classes",
    "students": "Étudiants",
    "teachers": "Enseignants",
    "attendance": "Présence",
    "grades": "Notes",
    "schedule": "Horaire",
    "createClassroom": "Créer une classe",
    "classroomName": "Nom de la classe",
    "description": "Description",
    "capacity": "Capacité",
    "subject": "Matière"
  },
  "navigation": {
    "home": "Accueil",
    "dashboard": "Tableau de bord",
    "classroom": "Classe",
    "inbox": "Boîte de réception",
    "profile": "Profil",
    "settings": "Paramètres"
  }
}
```

### Arabic (messages/ar.json)
```json
{
  "common": {
    "welcome": "مرحباً، {name}!",
    "loading": "جاري التحميل...",
    "error": "حدث خطأ",
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "create": "إنشاء",
    "search": "بحث",
    "filter": "تصفية",
    "actions": "الإجراءات"
  },
  "auth": {
    "signin": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "logout": "تسجيل الخروج",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "confirmPassword": "تأكيد كلمة المرور",
    "forgotPassword": "نسيت كلمة المرور؟",
    "rememberMe": "تذكرني",
    "signinSuccess": "تم تسجيل الدخول بنجاح",
    "signupSuccess": "تم إنشاء الحساب بنجاح",
    "invalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة"
  },
  "classroom": {
    "dashboard": "لوحة التحكم",
    "classes": "الفصول",
    "students": "الطلاب",
    "teachers": "المعلمون",
    "attendance": "الحضور",
    "grades": "الدرجات",
    "schedule": "الجدول",
    "createClassroom": "إنشاء فصل دراسي",
    "classroomName": "اسم الفصل",
    "description": "الوصف",
    "capacity": "السعة",
    "subject": "المادة"
  },
  "navigation": {
    "home": "الرئيسية",
    "dashboard": "لوحة التحكم",
    "classroom": "الفصل الدراسي",
    "inbox": "صندوق الوارد",
    "profile": "الملف الشخصي",
    "settings": "الإعدادات"
  }
}
```

## Layout and RTL Support

### Root Layout with Locale Support
```typescript
// app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={clsx(inter.variable, kufi.variable)}
      suppressHydrationWarning
    >
      <body className={clsx(inter.className, isRTL && "font-kufi")}>
        <ReduxProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <AuthProvider>
                <CalendarProvider>
                  {children}
                  <Toaster />
                </CalendarProvider>
              </AuthProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
```

### Font Configuration
```typescript
// app/layout.tsx
import { Inter, Noto_Kufi_Arabic } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-kufi",
  display: "swap",
});
```

### RTL Styles
```css
/* styles/rtl.css */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .flex {
  flex-direction: row-reverse;
}

[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

[dir="rtl"] .ml-2 {
  margin-left: 0;
  margin-right: 0.5rem;
}

[dir="rtl"] .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

[dir="rtl"] .pl-4 {
  padding-left: 0;
  padding-right: 1rem;
}

[dir="rtl"] .pr-4 {
  padding-right: 0;
  padding-left: 1rem;
}

/* Custom RTL utilities */
.rtl\:text-right[dir="rtl"] {
  text-align: right;
}

.rtl\:flex-row-reverse[dir="rtl"] {
  flex-direction: row-reverse;
}
```

## Language Switching

### Language Switcher Component
```typescript
// components/language-switcher.tsx
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { COOKIE_NAME } from '@/config';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Refresh the page to apply new locale
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {languages.find(lang => lang.code === locale)?.flag}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {locale === language.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Locale Switcher Select
```typescript
// components/common/LocaleSwitcherSelect.tsx
interface LocaleSwitcherSelectProps {
  defaultValue: string;
  items: Array<{
    value: string;
    label: string;
  }>;
  label: string;
}

export function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: LocaleSwitcherSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(value: string) {
    startTransition(() => {
      document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    });
  }

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onSelectChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

## Using Translations in Components

### Basic Translation Usage
```typescript
// components/WelcomeMessage.tsx
import { useTranslations } from 'next-intl';

export function WelcomeMessage({ userName }: { userName: string }) {
  const t = useTranslations('common');
  
  return (
    <h1 className="text-2xl font-bold">
      {t('welcome', { name: userName })}
    </h1>
  );
}
```

### Namespace-specific Translations
```typescript
// components/auth/SigninForm.tsx
import { useTranslations } from 'next-intl';

export function SigninForm() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  return (
    <form>
      <h2>{t('signin')}</h2>
      <input placeholder={t('email')} />
      <input type="password" placeholder={t('password')} />
      <button type="submit">
        {tCommon('loading') ? tCommon('loading') : t('signin')}
      </button>
    </form>
  );
}
```

### Rich Text and HTML
```typescript
// components/RichTextExample.tsx
import { useTranslations } from 'next-intl';

export function RichTextExample() {
  const t = useTranslations('common');

  return (
    <div>
      {t.rich('welcomeMessage', {
        name: 'John',
        strong: (chunks) => <strong>{chunks}</strong>,
        link: (chunks) => <a href="/profile">{chunks}</a>
      })}
    </div>
  );
}
```

### Pluralization
```typescript
// messages/en.json
{
  "items": {
    "count": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
  }
}

// Component usage
export function ItemCount({ count }: { count: number }) {
  const t = useTranslations('items');
  
  return <span>{t('count', { count })}</span>;
}
```

## Date and Number Formatting

### Date Formatting
```typescript
// utils/dateFormatting.ts
import { useFormatter, useLocale } from 'next-intl';

export function useDateFormatting() {
  const format = useFormatter();
  const locale = useLocale();

  const formatDate = (date: Date) => {
    return format.dateTime(date, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (date: Date) => {
    return format.relativeTime(date);
  };

  return { formatDate, formatRelativeTime };
}

// Component usage
export function DateDisplay({ date }: { date: Date }) {
  const { formatDate } = useDateFormatting();
  
  return <span>{formatDate(date)}</span>;
}
```

### Number Formatting
```typescript
// components/PriceDisplay.tsx
import { useFormatter } from 'next-intl';

export function PriceDisplay({ amount, currency = 'USD' }: {
  amount: number;
  currency?: string;
}) {
  const format = useFormatter();
  
  return (
    <span>
      {format.number(amount, {
        style: 'currency',
        currency,
      })}
    </span>
  );
}
```

## Server-Side Translations

### Server Components
```typescript
// app/dashboard/page.tsx
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('classroom');

  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <p>{t('welcomeMessage')}</p>
    </div>
  );
}
```

### Metadata Translations
```typescript
// app/dashboard/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('classroom');

  return {
    title: t('dashboard'),
    description: t('dashboardDescription'),
  };
}
```

## API Integration with Locales

### Sending Locale to API
```typescript
// services/base/apiService.ts
export class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    locale?: string,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (locale) {
      headers['Accept-Language'] = locale;
      headers['locale'] = locale;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response.json();
  }
}
```

### Using Locale in RTK Query
```typescript
// store/api/baseApi.ts
export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add locale from cookie or default
      const locale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] || 'en';
      
      headers.set('locale', locale);
      headers.set('Accept-Language', locale);
      
      return headers;
    },
  }),
  // ... rest of configuration
});
```

## Best Practices

### 1. Translation Keys
- Use nested namespaces for organization
- Keep keys descriptive and consistent
- Use camelCase for key names
- Group related translations together

### 2. Pluralization
- Use ICU message format for complex pluralization
- Consider different plural rules for different languages
- Test pluralization with various numbers

### 3. RTL Support
- Test all UI components with RTL layout
- Use logical CSS properties (margin-inline-start vs margin-left)
- Consider text direction in animations and transitions
- Test form layouts and validation messages

### 4. Performance
- Use lazy loading for large translation files
- Consider splitting translations by route or feature
- Cache translations appropriately
- Minimize translation bundle size

### 5. Maintenance
- Use TypeScript for translation key validation
- Implement translation key extraction tools
- Keep translations synchronized across languages
- Use professional translation services for accuracy