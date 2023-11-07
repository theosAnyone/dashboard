import { configureStore} from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import themeReducer from '../features/theme/themeSlice'
import searchReducer from '../components/SearchBarSlice'
import authReducer from '../features/auth/authSlice'
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authReducer,
        theme: themeReducer,
        search: searchReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

setupListeners(store.dispatch)