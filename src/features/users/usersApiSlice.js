    import {
        createSelector,
        createEntityAdapter
    } from "@reduxjs/toolkit";
    import { apiSlice } from "../../app/api/apiSlice"

    const usersAdapter = createEntityAdapter({})

    const initialState = usersAdapter.getInitialState()

    export const usersApiSlice = apiSlice.injectEndpoints({
        endpoints: builder => ({
            getUsers: builder.query({
                query: () => '/users',
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled

                    } catch (err) {
                        console.log(err)
                    }
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
                transformResponse: responseData => {
                    const loadedUsers = responseData.map(user => {
                        user.id = user._id
                        return user
                    });
                    return usersAdapter.setAll(initialState, loadedUsers)
                },
                providesTags: (result, error, arg) => {
                    if (result?.ids) {
                        return [
                            { type: 'User', id: 'LIST' },
                            ...result.ids.map(id => ({ type: 'User', id }))
                        ]
                    } else return [{ type: 'User', id: 'LIST' }]
                }
            }),
            getUserById: builder.query({
                query: (userId) => `/users/id/${userId}`,
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled

                    } catch (err) {
                        console.log(err)
                    }
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
                providesTags: (result, error, userId) => [{ type: 'User', id: userId }]
            }), 
            addNewUser: builder.mutation({
                query: initialUserData => ({
                    url: '/users',
                    method: 'POST',
                    body: {
                        ...initialUserData,
                    }
                }),
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled

                    } catch (err) {
                        console.log(err)
                    }
                },
                invalidatesTags: [
                    { type: 'User', id: "LIST" }
                ]
            }),
            updateUser: builder.mutation({
                query: initialUserData => ({
                    url: '/users',
                    method: 'PATCH',
                    body: {
                        ...initialUserData,
                    }
                }),
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled

                    } catch (err) {
                        console.log(err)
                    }
                },
                invalidatesTags: (result, error, arg) => [
                    { type: 'User', id: arg.id }
                ]
            }),
            deleteUser: builder.mutation({
                query: ({ id }) => ({
                    url: `/users`,
                    method: 'DELETE',
                    body: { id }
                }),
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled

                    } catch (err) {
                        console.log(err)
                    }
                },
                invalidatesTags: (result, error, arg) => [
                    { type: 'User', id: arg.id }
                ]
            }),
        }),
    })

    export const {
        useGetUsersQuery,
        useAddNewUserMutation,
        useUpdateUserMutation,
        useDeleteUserMutation,
        useGetUserByIdQuery,
    } = usersApiSlice

    // returns the query result object
    export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()
    // creates memoized selector
    const selectUsersData = createSelector(
        selectUsersResult,
        usersResult => usersResult.data // normalized state object with ids & entities
    )
    //getSelectors creates these selectors and we rename them with aliases using destructuring
    export const {
        selectAll: selectAllUsers,
        selectById: selectUserById,
        selectIds: selectUserIds
        // Pass in a selector that returns the users slice of state
    } = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)