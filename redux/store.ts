import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import userReducer from "./features/user/userSlice";
import baseApi from "./api/baseApi";
// import baseApi from "./api/baseApi";

// Create a noop storage for SSR (server-side safe)
const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

// Safe storage that works on all machines - avoids direct localStorage access during SSR
const storage =
  typeof window !== "undefined"
    ? {
        getItem(key: string) {
          return Promise.resolve(window.localStorage.getItem(key));
        },
        setItem(key: string, value: string) {
          return Promise.resolve(window.localStorage.setItem(key, value));
        },
        removeItem(key: string) {
          return Promise.resolve(window.localStorage.removeItem(key));
        },
      }
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  blacklist: [baseApi.reducerPath],
};

const rootReducer = combineReducers({
  user: userReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
