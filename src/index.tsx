import React from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './store'

import './index.scss'

import { theme } from './theme'

import NotificationProvider from './providers/NotificationProvider'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
