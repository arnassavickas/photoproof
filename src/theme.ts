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
      main: 'rgba(41, 46, 136, 1)',
      dark: 'rgba(73, 86, 158, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(138, 35, 70, 1)',
      main: 'rgba(103, 9, 42, 1)',
      dark: 'rgba(152, 14, 63, 1)',
      contrastText: 'rgba(255, 255, 255, 1)',
    },
    error: {
      light: 'rgba(179, 135, 135, 1)',
      main: 'rgba(128, 70, 50, 1)',
      dark: 'rgba(102, 50, 50, 1)',
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
        color: '#eee',
        '&:hover': {
          backgroundColor: '#666',
          color: '#eee',
        },
      },
      outlined: {
        borderColor: '#eee',
      },
      textPrimary: {
        color: 'rgba(188, 194, 230)',
      },
      textSecondary: {
        color: 'rgb(255, 87, 29);',
      },
    },
    MuiTableCell: {
      head: {
        fontSize: '1rem !important',
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    },
    MuiOutlinedInput: {
      root: {
        '&$disabled': {
          color: '#eee',
        },
      },
      notchedOutline: {
        borderWidth: '1px',
        borderColor: '#eee',
      },
    },
    MuiCheckbox: {
      root: {
        color: '#aaa',
        '&$disabled': {
          color: '#555',
        },
      },
    },
    MuiTableRow: {
      hover: {
        '&:hover': {
          backgroundColor: '#444 !important',
          cursor: 'pointer',
        },
      },
    },
    MuiDialogTitle: {
      root: {
        paddingRight: '3rem',
      },
    },
  },
});
export default theme;
