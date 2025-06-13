import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";
interface ThemeState {
  currentTheme: Theme;
  isInitialized: boolean;
}

const initialState: ThemeState = {
  currentTheme: "light", // Default value, will be updated on client
  isInitialized: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      state.isInitialized = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(action.payload);
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.currentTheme === "light" ? "dark" : "light";
      state.currentTheme = newTheme;
      state.isInitialized = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
      }
    },
    initializeTheme: (state, action: PayloadAction<Theme>) => {
      if (!state.isInitialized) {
        state.currentTheme = action.payload;
        state.isInitialized = true;
      }
    },
  },
});

export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
