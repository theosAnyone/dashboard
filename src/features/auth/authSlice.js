
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, teacher_id:null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, teacher_id } = action.payload
            state.token = accessToken
            state.teacher_id = teacher_id
        },
        logOut: (state, action) => {
            state.token = null
            state.teacher_id = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const selectTeacherId = (state) => state.auth.teacher_id
