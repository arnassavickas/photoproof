/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UiState } from '../types'

const initialState: { value: UiState; loaderProgress: number } = {
  value: UiState.Pending,
  loaderProgress: 0,
}

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    setUiState: (state, action: PayloadAction<UiState>) => {
      state.value = action.payload
    },
    setLoaderProgress: (state, action: PayloadAction<number>) => {
      state.loaderProgress = action.payload
    },
  },
})

export const { setUiState, setLoaderProgress } = uiStateSlice.actions

export default uiStateSlice.reducer
