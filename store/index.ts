import { configureStore } from "@reduxjs/toolkit";

// Import slices here as they're created
import musicSlice from "./slices/musicSlice";
import playerSlice from "./slices/playerSlice";

export const store = configureStore({
  reducer: {
    // Add your reducers here
    music: musicSlice,
    player: playerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
