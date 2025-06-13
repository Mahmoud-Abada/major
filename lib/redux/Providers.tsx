"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";
import { initializeLanguage } from "./slices/languageSlice";
import { initializeTheme } from "./slices/themeSlice";

export default function ReduxProviders({
  children,
}: {
  children: React.ReactNode;
  lang?: string;
  theme?: string;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (typeof window !== "undefined" && storeRef.current) {
      // Initialize theme
      const savedTheme = localStorage.getItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const initialTheme = (savedTheme || systemTheme) as "light" | "dark";

      storeRef.current.dispatch(initializeTheme(initialTheme));
      document.documentElement.classList.add(initialTheme);

      // Initialize language
      const savedLang = localStorage.getItem("lang");
      const navLang = navigator.language.startsWith("ar")
        ? "ar"
        : navigator.language.startsWith("fr")
          ? "fr"
          : "en";
      const initialLang = (savedLang || navLang) as "ar" | "en" | "fr";

      storeRef.current.dispatch(initializeLanguage(initialLang));
      document.documentElement.lang = initialLang;
      document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
