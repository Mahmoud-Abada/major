"use client";

import { useLanguage } from "@/lib/redux/hooks/useLanguage";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLang("ar")}
        className={lang === "ar" ? "font-bold" : ""}
      >
        العربية
      </button>
      <button
        onClick={() => setLang("en")}
        className={lang === "en" ? "font-bold" : ""}
      >
        English
      </button>
      <button
        onClick={() => setLang("fr")}
        className={lang === "fr" ? "font-bold" : ""}
      >
        Français
      </button>
    </div>
  );
}
