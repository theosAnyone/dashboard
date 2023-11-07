import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const teachersAdapter = createEntityAdapter({})

const initialState = teachersAdapter.getInitialState()

export const teachersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTeachers: builder.query({
            query: () => '/teachers',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedTeachers = responseData.map(teacher => {
                    teacher.id = teacher._id
                    return teacher
                });
                return teachersAdapter.setAll(initialState, loadedTeachers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Teacher', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Teacher', id }))
                    ]
                } else return [{ type: 'Teacher', id: 'LIST' }]
            }
        }),
        getTeacherById: builder.query({
            query: (teacherId) => `/teachers/id/${teacherId}`,
            providesTags: (result, error, teacherId) => [{ type: 'Teacher', id: teacherId }]
        }),
        addNewTeacher: builder.mutation({
            query: initialTeacherData => ({
                url: '/teachers',
                method: 'POST',
                body: {
                    ...initialTeacherData,
                }
            }),
            invalidatesTags: [
                { type: 'Teacher', id: "LIST" }
            ],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log("data:",data)
                    
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        updateTeacher: builder.mutation({
            query: initialTeacherData => ({
                url: '/teachers',
                method: 'PATCH',
                body: {
                    ...initialTeacherData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Teacher', id: arg.id }
            ]
        }),
        deleteTeacher: builder.mutation({
            query: ({ id }) => ({
                url: `/teachers`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Teacher', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
    useAddNewTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
} = teachersApiSlice

// returns the query result object
export const selectTeachersResult = teachersApiSlice.endpoints.getTeachers.select()

// creates memoized selector
const selectTeachersData = createSelector(
    selectTeachersResult,
    teachersResult => teachersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTeachers,
    selectById: selectTeacherById,
    selectIds: selectTeacherIds
    // Pass in a selector that returns the teachers slice of state
} = teachersAdapter.getSelectors(state => selectTeachersData(state) ?? initialState)