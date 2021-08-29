/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

type Filter = 'all' | 'selected' | 'unselected'

export interface CollectionsState {
  collectionsList: Collection[]
  currentId: string | null
  filter: Filter
  reorderPending: boolean
  listFetchPending: boolean
}

const initialState: CollectionsState = {
  collectionsList: [],
  currentId: null,
  filter: 'all',
  reorderPending: false,
  listFetchPending: true,
}

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const getCurrentCollection = (collections: Collection[], id: string | null) =>
  collections.find(collection => collection.id === id)

const getSelectedPhoto = (
  photoId: string,
  collections: Collection[],
  collectionId: string | null,
) => {
  const currentCollection = getCurrentCollection(collections, collectionId)
  if (!currentCollection) return null

  return currentCollection.photos.find(photo => photo.id === photoId)
}

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollectionsList: (state, action: PayloadAction<Collection[]>) => {
      state.collectionsList = action.payload
      state.listFetchPending = false
    },
    deleteCollectionState: (state, action: PayloadAction<string>) => {
      state.collectionsList = state.collectionsList.filter(
        collection => collection.id !== action.payload,
      )
    },
    setCollection: (state, action: PayloadAction<Collection>) => {
      state.collectionsList = [...state.collectionsList, action.payload]
    },
    setPhotoFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload
    },
    changeOrder: (state, action: PayloadAction<{ source: number; destination: number }>) => {
      state.reorderPending = true

      const currentCollection = getCurrentCollection(state.collectionsList, state.currentId)
      if (!currentCollection) return

      const reorderedPhotos = reorder(
        currentCollection.photos,
        action.payload.source,
        action.payload.destination,
      )

      currentCollection.photos = reorderedPhotos.map((photo, index) => ({
        ...photo,
        index: index + 1,
      }))
    },
    setCollectionStatus: (state, action: PayloadAction<Collection['status']>) => {
      const currentCollection = getCurrentCollection(state.collectionsList, state.currentId)
      if (!currentCollection) return

      currentCollection.status = action.payload
    },
    editCollectionDetails: (
      state,
      action: PayloadAction<
        Pick<Collection, 'title' | 'minSelect' | 'maxSelect' | 'allowComments' | 'status'>
      >,
    ) => {
      const currentCollection = getCurrentCollection(state.collectionsList, state.currentId)
      if (!currentCollection) return

      currentCollection.title = action.payload.title
      currentCollection.minSelect = action.payload.minSelect
      currentCollection.maxSelect = action.payload.maxSelect
      currentCollection.allowComments = action.payload.allowComments
      currentCollection.status = action.payload.status
    },
    setReorderPending: (state, action: PayloadAction<boolean>) => {
      state.reorderPending = action.payload
    },
    setCurrentId: (state, action: PayloadAction<string>) => {
      state.currentId = action.payload
    },
    setPhotoSelection: (state, action: PayloadAction<string>) => {
      const selectedPhoto = getSelectedPhoto(action.payload, state.collectionsList, state.currentId)
      if (!selectedPhoto) return

      selectedPhoto.selected = !selectedPhoto.selected
    },
  },
})

export const {
  setCollection,
  deleteCollectionState,
  setPhotoFilter,
  changeOrder,
  setReorderPending,
  setCollectionsList,
  setCurrentId,
  setCollectionStatus,
  editCollectionDetails,
  setPhotoSelection,
} = collectionsSlice.actions

export default collectionsSlice.reducer
