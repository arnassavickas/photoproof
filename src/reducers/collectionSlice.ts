/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Collection } from '../types'

type Filter = 'all' | 'selected' | 'unselected'

export interface CollectionState {
  data: Collection
  filter: Filter
  filteredPhotos: Collection['photos']
}

const initialState: CollectionState = {
  data: {
    id: '',
    dateCreated: new Date(),
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
      state.data.photos = reorder(
        state.data.photos,
        action.payload.source,
        action.payload.destination,
      )
      state.filteredPhotos = getFilteredPhotos(state.filter, state.data.photos)
    },
  },
})

export const { setCollection, setPhotoFilter, changeOrder } = collectionSlice.actions

export default collectionSlice.reducer
