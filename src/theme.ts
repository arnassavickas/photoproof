import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    common: { black: '#000', white: '#fff' },
    background: {
      paper: 'rgba(64, 64, 64, 1)',
      default: 'rgba(39, 39, 43, 1)',
    },
    primary: {
      light: 'rgba(149, 154, 184, 1)',
      main: 'rgba(128, 134, 152, 1)',
      dark: 'rgba(45, 53, 99, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(138, 35, 70, 1)',
      main: 'rgba(103, 9, 42, 1)',
      dark: '#c51162',
      contrastText: 'rgba(255, 255, 255, 1)',
    },
    error: {
      light: 'rgba(179, 135, 135, 1)',
      main: 'rgba(128, 34, 28, 1)',
      dark: 'rgba(102, 23, 23, 1)',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(241, 241, 241, 1)',
      secondary: 'rgba(228, 228, 228, 1)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: '#555',
        color: '#ccc',
        '&:hover': {
          backgroundColor: '#666',
          color: '#ccc',
        },
      },
    },
  },
});
export default theme;
