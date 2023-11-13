import { createSlice } from "@reduxjs/toolkit";

const teacherSlice = createSlice({
  name: "teacher",
  initialState: { id:"", first_name:"", last_name:"", anyone_profile:"" },
  reducers: {
    setInfos: (state, action) => {
        const payload = action.payload
        console.log(action.payload);
        for(const key in payload){
            if(key in state){
                state[key] = payload[key]
            } else {
                console.log("error key not found in state")
            }
        }
    },
  },
});

export const { setInfos } = teacherSlice.actions;

export default teacherSlice.reducer;

export const selectTeacherId = (state) => state.teacher.teacher_id;
