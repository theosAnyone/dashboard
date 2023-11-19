import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const botsAdapter = createEntityAdapter({})

const initialState = botsAdapter.getInitialState()

export const botsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBots: builder.query({
            query: () => '/discordBot',
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
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Bot', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Bot', id }))
                    ]
                } else return [{ type: 'Bot', id: 'LIST' }]
            }
        }),
        addNewBot: builder.mutation({
            query: initialBotData => ({
                url: '/discordBot',
                method: 'POST',
                body: {
                    ...initialBotData,
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
                { type: 'Bot', id: "LIST" }
            ]
        }),
        updateBot: builder.mutation({
            query: initialBotData => ({
                url: '/discordBot',
                method: 'PATCH',
                body: {
                    ...initialBotData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Bot', id: arg.id }
            ]
        }),
        deleteBot: builder.mutation({
            query: ({ id }) => ({
                url: `/discordBot`,
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
                { type: 'Bot', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetBotsQuery,
    useAddNewBotMutation,
    useUpdateBotMutation,
    useDeleteBotMutation,
} = botsApiSlice

// returns the query result object
export const selectBotsResult = botsApiSlice.endpoints.getBots.select()

// creates memoized selector
const selectBotsData = createSelector(
    selectBotsResult,
    botsResult => botsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllBots,
    selectById: selectBotById,
    selectIds: selectBotIds
    // Pass in a selector that returns the bots slice of state
} = botsAdapter.getSelectors(state => selectBotsData(state) ?? initialState)