import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import NotificationProvider from '../providers/NotificationProvider'
import collectionReducer from '../reducers/collectionsSlice'
import siteSettingsReducer from '../reducers/siteSettingsSlice'
import uiStateReducer from '../reducers/uiStateSlice'

const AllTheProviders: React.FC = ({ children }) => (
  <NotificationProvider>{children}</NotificationProvider>
)

interface customRenderedOptions {
  options?: Omit<RenderOptions, 'queries'>
  initialState?: any
}

const customRender = (
  ui: React.ReactElement,
  { options, initialState = {} }: customRenderedOptions = {},
) => {
  const mockStore = configureStore({
    reducer: {
      collections: collectionReducer,
      uiState: uiStateReducer,
      siteSettings: siteSettingsReducer,
    },
    preloadedState: initialState,
  })

  return render(<Provider store={mockStore}>{ui}</Provider>, {
    wrapper: AllTheProviders,
    ...options,
  })
}

export * from '@testing-library/react'

export { customRender as render }
