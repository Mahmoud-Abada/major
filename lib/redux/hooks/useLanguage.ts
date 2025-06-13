"use client";

import { useAppDispatch, useAppSelector } from ".";
import { setLanguage, initializeLanguage } from "../slices/languageSlice";

export const useLanguage = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.language.currentLang);
  const isInitialized = useAppSelector((state) => state.language.isInitialized);

  const setLang = (lang: "ar" | "en" | "fr") => {
    dispatch(setLanguage(lang));
  };

  const initializeLang = (lang: "ar" | "en" | "fr") => {
    dispatch(initializeLanguage(lang));
  };

  return { lang, setLang, initializeLang, isInitialized };
};
