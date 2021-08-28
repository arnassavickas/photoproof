/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SiteSettingsState {
  logoUrl: string
  logoWidth: number
  email: string
}

const initialState: SiteSettingsState = {
  logoUrl: '',
  logoWidth: 0,
  email: '',
}

export const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    setSiteSettings: (state, action: PayloadAction<SiteSettingsState>) => {
      state.logoUrl = action.payload.logoUrl
      state.logoWidth = action.payload.logoWidth
      state.email = action.payload.email
    },
    setLogoUrl: (state, action: PayloadAction<string>) => {
      state.logoUrl = action.payload
    },
    setLogoWidth: (state, action: PayloadAction<number>) => {
      state.logoWidth = action.payload
    },
  },
})

export const { setSiteSettings, setLogoUrl, setLogoWidth } = siteSettingsSlice.actions

export default siteSettingsSlice.reducer
