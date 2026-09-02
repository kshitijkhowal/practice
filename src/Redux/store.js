import { configureStore } from "@reduxjs/toolkit";
import ReduxCounter from "./Slices/counterSlice";

const store = configureStore({
    reducer: {
        counter: ReduxCounter,
    }
})

export default store;