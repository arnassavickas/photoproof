import { configureStore } from '@reduxjs/toolkit'

import collectionsReducer from './reducers/collectionsSlice'
import siteSettingsReducer from './reducers/siteSettingsSlice'
import uiStateReducer from './reducers/uiStateSlice'

export const store = configureStore({
  reducer: {
    collections: collectionsReducer,
    uiState: uiStateReducer,
    siteSettings: siteSettingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
