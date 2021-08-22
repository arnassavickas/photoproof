import { configureStore } from '@reduxjs/toolkit'

import collectionReducer from './reducers/collectionSlice'
import uiStateReducer from './reducers/uiStateSlice'

export const store = configureStore({
  reducer: {
    collection: collectionReducer,
    uiState: uiStateReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
