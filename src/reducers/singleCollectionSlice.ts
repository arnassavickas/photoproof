/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

type Filter = 'all' | 'selected' | 'unselected'

export interface SingleCollectionState {
  collection: Collection | null
  filter: Filter
  filteredPhotos: Collection['photos']
  reorderPending: boolean
}

const initialState: SingleCollectionState = {
  collection: null,
  filter: 'all',
  filteredPhotos: [],
  reorderPending: false,
}

const getFilteredPhotos = (filter: Filter, photos: Collection['photos']) => {
  if (filter === 'all') {
    return photos
  }

  if (filter === 'selected') {
    return photos.filter(photo => photo.selected)
  }

  if (filter === 'unselected') {
    return photos.filter(photo => !photo.selected)
  }

  return []
}

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const singleCollectionSlice = createSlice({
  name: 'singleCollection',
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<Collection>) => {
      state.collection = action.payload

      state.filteredPhotos = getFilteredPhotos('all', state.collection.photos)
    },
    setPhotoFilter: (state, action: PayloadAction<Filter>) => {
      if (!state.collection) return

      state.filter = action.payload

      state.filteredPhotos = getFilteredPhotos(action.payload, state.collection.photos)
    },
    changeOrder: (state, action: PayloadAction<{ source: number; destination: number }>) => {
      if (!state.collection) return

      state.reorderPending = true

      const reorderedPhotos = reorder(
        state.collection.photos,
        action.payload.source,
        action.payload.destination,
      )

      state.collection.photos = reorderedPhotos.map((photo, index) => ({
        ...photo,
        index: index + 1,
      }))

      state.filteredPhotos = getFilteredPhotos(state.filter, state.collection.photos)
    },
    setReorderPending: (state, action: PayloadAction<boolean>) => {
      state.reorderPending = action.payload
    },
  },
})

export const { setCollection, setPhotoFilter, changeOrder, setReorderPending } =
  singleCollectionSlice.actions

export default singleCollectionSlice.reducer
