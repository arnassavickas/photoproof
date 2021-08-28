/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

type Filter = 'all' | 'selected' | 'unselected'

export interface CollectionState {
  data: Collection
  filter: Filter
  filteredPhotos: Collection['photos']
  reorderPending: boolean
}

const initialState: CollectionState = {
  data: {
    id: '',
    dateCreated: 0,
    title: '',
    minSelect: { required: false, goal: 0 },
    maxSelect: { required: false, goal: 0 },
    allowComments: true,
    status: 'editing',
    finalComment: '',
    photos: [],
  },
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

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<Collection>) => {
      state.data = action.payload
      state.filteredPhotos = getFilteredPhotos('all', state.data.photos)
    },
    setPhotoFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload
      state.filteredPhotos = getFilteredPhotos(action.payload, state.data.photos)
    },
    changeOrder: (state, action: PayloadAction<{ source: number; destination: number }>) => {
      state.reorderPending = true
      const reorderedPhotos = reorder(
        state.data.photos,
        action.payload.source,
        action.payload.destination,
      )
      state.data.photos = reorderedPhotos.map((photo, index) => ({ ...photo, index: index + 1 }))
      state.filteredPhotos = getFilteredPhotos(state.filter, state.data.photos)
    },
    setReorderPending: (state, action: PayloadAction<boolean>) => {
      state.reorderPending = action.payload
    },
  },
})

export const { setCollection, setPhotoFilter, changeOrder, setReorderPending } =
  collectionSlice.actions

export default collectionSlice.reducer
