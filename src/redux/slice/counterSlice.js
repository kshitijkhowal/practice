/* eslint-disable no-unused-vars */
const { createSlice } = require("@reduxjs/toolkit");

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0,
    },
    reducers: {
        increment: (state) => {
            state.count += 1;
        },
        decrement: (state) => {
            state.count -= 1;
        },
    }
    
})

export const {increment, decrement} = counterSlice.actions;

const counterReducer = counterSlice.reducer

export default counterReducer;