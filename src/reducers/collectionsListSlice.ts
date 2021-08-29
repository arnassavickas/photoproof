/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

export interface CollectionsListState {
  collections: Collection[]
}

const initialState: CollectionsListState = {
  collections: [],
}

export const collectionsListSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionsList: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload
    },
    deleteCollectionState: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter(collection => collection.id !== action.payload)
    },
  },
})

export const { setCollectionsList, deleteCollectionState } = collectionsListSlice.actions

export default collectionsListSlice.reducer
