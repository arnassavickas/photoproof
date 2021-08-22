import { configureStore } from '@reduxjs/toolkit'

import collectionReducer from './reducers/collectionSlice'
import collectionsReducer from './reducers/collectionsListSlice'
import siteSettingsReducer from './reducers/siteSettingsSlice'
import uiStateReducer from './reducers/uiStateSlice'

export const store = configureStore({
  reducer: {
    collection: collectionReducer,
    collectionsList: collectionsReducer,
    uiState: uiStateReducer,
    siteSettings: siteSettingsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
