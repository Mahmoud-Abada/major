"use client";

import { useAppDispatch, useAppSelector } from ".";
import { setTheme, toggleTheme, initializeTheme } from "../slices/themeSlice";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const isInitialized = useAppSelector((state) => state.theme.isInitialized);

  const setCurrentTheme = (theme: "light" | "dark") => {
    dispatch(setTheme(theme));
  };

  const toggleCurrentTheme = () => {
    dispatch(toggleTheme());
  };

  const initTheme = (theme: "light" | "dark") => {
    dispatch(initializeTheme(theme));
  };

  return {
    theme,
    setTheme: setCurrentTheme,
    toggleTheme: toggleCurrentTheme,
    initializeTheme: initTheme,
    isInitialized,
  };
};
