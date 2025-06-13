import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Language = "ar" | "en" | "fr";
interface LanguageState {
  currentLang: Language;
  isInitialized: boolean;
}

const initialState: LanguageState = {
  currentLang: "en", // Default value, will be updated on client
  isInitialized: false,
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLang = action.payload;
      state.isInitialized = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("lang", action.payload);
        document.documentElement.lang = action.payload;
        document.documentElement.dir = action.payload === "ar" ? "rtl" : "ltr";
      }
    },
    initializeLanguage: (state, action: PayloadAction<Language>) => {
      if (!state.isInitialized) {
        state.currentLang = action.payload;
        state.isInitialized = true;
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
