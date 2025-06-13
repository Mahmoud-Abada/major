import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/languageSlice";
import userRoleReducer from "./slices/roleSlice";
import themeReducer from "./slices/themeSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      language: languageReducer,
      theme: themeReducer,
      userRole: userRoleReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
