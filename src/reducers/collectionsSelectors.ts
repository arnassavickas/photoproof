import { RootState } from '../store'

export const getCurrentCollection = () => (state: RootState) => {
  return state.collections.collectionsList.find(
    collection => collection.id === state.collections.currentId,
  )
}

export const getFilteredPhotos = () => (state: RootState) => {
  const currentCollection = state.collections.collectionsList.find(
    collection => collection.id === state.collections.currentId,
  )

  if (!currentCollection) return []

  if (state.collections.filter === 'selected')
    return currentCollection.photos.filter(photo => photo.selected)

  if (state.collections.filter === 'unselected')
    return currentCollection.photos.filter(photo => !photo.selected)

  return currentCollection.photos
}
