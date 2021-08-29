/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

export interface CollectionsListState {
  collectionsList: Collection[]
}

const initialState: CollectionsListState = {
  collectionsList: [],
}

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
})

export const { setCollectionsList, deleteCollectionState } = collectionsListSlice.actions

export default collectionsListSlice.reducer
