import { configureStore } from '@reduxjs/toolkit'

import singleCollectionReducer from './reducers/singleCollectionSlice'
import collectionsReducer from './reducers/collectionsListSlice'
import siteSettingsReducer from './reducers/siteSettingsSlice'
import uiStateReducer from './reducers/uiStateSlice'

export const store = configureStore({
  reducer: {
    singleCollection: singleCollectionReducer,
    collectionsList: collectionsReducer,
    uiState: uiStateReducer,
    siteSettings: siteSettingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
