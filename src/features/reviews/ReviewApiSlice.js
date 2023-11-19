import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const reviewsAdapter = createEntityAdapter({})

const initialState = reviewsAdapter.getInitialState()

export const reviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReviews: builder.query({
            query: () => '/reviews',
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
                const loadedReviews = responseData.map(review => {
                    review.id = review._id
                    return review
                });
                return reviewsAdapter.setAll(initialState, loadedReviews)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            }
        }),
        getUserReviews:builder.query({
            query: (user_id) => `/reviews/user/${user_id}`,
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

                if(!Array.isArray(responseData)){
                    if(responseData){
                        responseData.id = responseData._id
                        return (reviewsAdapter.setAll(initialState,responseData))
                    } else {
                        return initialState
                    }
                }
                const loadedReviews =  responseData.map(review => {
                    review.id = review._id
                    return review
                });
                return reviewsAdapter.setAll(initialState, loadedReviews)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            }
        }),
        getReviewById: builder.query({
            query: (reviewId) => `/reviews/id/${reviewId}`,
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
                if(!Array.isArray(responseData)){
                    if(responseData){
                        responseData.id = responseData._id
                        return (reviewsAdapter.setAll(initialState,responseData))
                    } else {
                        return initialState
                    }
                }
                const loadedReviews =  responseData.map(review => {
                    review.id = review._id
                    return review
                });
                return reviewsAdapter.setAll(initialState, loadedReviews)
            },
            providesTags: (result, error, reviewId) => [{ type: 'Review', id: reviewId }]

        }),
        addNewReview: builder.mutation({
            query: initialReviewData => ({
                url: '/reviews',
                method: 'POST',
                body: {
                    ...initialReviewData,
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
                { type: 'Review', id: "LIST" }
            ]
        }),
        updateReview: builder.mutation({
            query: initialReviewData => ({
                url: '/reviews',
                method: 'PATCH',
                body: {
                    ...initialReviewData,
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
                { type: 'Review', id: arg.id }
            ]
        }),
        deleteReview: builder.mutation({
            query: ({ id }) => ({
                url: `/reviews`,
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
                { type: 'Review', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetReviewsQuery,
    useGetUserReviewsQuery,
    useGetReviewByIdQuery,
    useAddNewReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewsApiSlice

// returns the query result object
export const selectReviewsResult = reviewsApiSlice.endpoints.getReviews.select()

export const selectUserReviews = (state, userId) => {
    const allReviews = selectAllReviews(state);
    return allReviews.filter(review => review.User === userId);
  }

// creates memoized selector
const selectReviewsData = createSelector(
    selectReviewsResult,
    reviewsResult => reviewsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllReviews,
    selectById: selectReviewById,
    selectIds: selectReviewIds
    // Pass in a selector that returns the reviews slice of state
} = reviewsAdapter.getSelectors(state => selectReviewsData(state) ?? initialState)