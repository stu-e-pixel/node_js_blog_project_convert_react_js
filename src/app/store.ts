import {configureStore} from "@reduxjs/toolkit"
import userReducer from "../features/auth/authSlice";
import blogReducer from "../features/blog/blogSlice"


export const store = configureStore({
    reducer:{
        user:userReducer,
        blog:blogReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;