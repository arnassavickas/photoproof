/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

export interface CollectionsListState {
  collectionsList: Collection[]
  currentRequestId: string
}

const initialState: CollectionsListState = {
  collectionsList: [],
  currentRequestId: '',
}

// TODO finidh with thunks
// export const fetchCollectionsList = createAsyncThunk<Collection[], void, { state: RootState }>(
//   'collectionsList/fetchList',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const collections = await getCollections()
//       return collections
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   },
// )

export const collectionsListSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionsList: (state, action: PayloadAction<Collection[]>) => {
      state.collectionsList = action.payload
    },
    deleteCollectionState: (state, action: PayloadAction<string>) => {
      state.collectionsList = state.collectionsList.filter(
        collection => collection.id !== action.payload,
      )
    },
  },
  // TODO finish with thunks
  // extraReducers: builder => {
  //   builder.addCase(fetchCollectionsList.pending, (state, action) => {
  //     console.log('pending')
  //   })
  //   builder.addCase(fetchCollectionsList.fulfilled, (state, action) => {
  //     console.log('fulfilled')
  //   })
  // },
})

export const { setCollectionsList, deleteCollectionState } = collectionsListSlice.actions

export default collectionsListSlice.reducer
