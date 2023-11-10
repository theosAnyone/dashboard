import { configureStore} from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice";
import themeReducer from '../features/theme/themeSlice'
import searchReducer from '../components/SearchBarSlice'
import authReducer from '../features/auth/authSlice'
import { setupListeners } from "@reduxjs/toolkit/query";
import teacherReducer from '../features/teachers/TeacherSlice'



const persistConfig = {
    key: 'root',
    storage,
    whiteList:['teacher']
}

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    theme: themeReducer,
    search: searchReducer,
    teacher: teacherReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === "development",
});

export const persistor = persistStore(store)

setupListeners(store.dispatch)