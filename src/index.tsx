import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { CssBaseline } from '@material-ui/core';
import NotificationProvider from './providers/NotificationProvider';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
