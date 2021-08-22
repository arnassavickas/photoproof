/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UiState } from '../types'

const initialState: { value: UiState } = {
  value: UiState.Pending,
}

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    setUiState: (state, action: PayloadAction<UiState>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUiState } = uiStateSlice.actions

export default uiStateSlice.reducer
