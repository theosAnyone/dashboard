import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name:'search',
    initialState: [],
    reducers : {
        setSearch : (state,action) => {
            if(action.payload.length === 1 && !action.payload[0]){
                return [];
            }
            
            return action.payload
        }
    }
})

export const { setSearch } = searchSlice.actions

export default searchSlice.reducer