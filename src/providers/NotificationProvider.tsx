import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Button, Slide } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  success: {
    backgroundColor: 'rgba(41, 136, 77, 1) !important',
    '& button': {
      color: 'white !important',
    },
  },
  error: {
    backgroundColor: 'rgba(138, 35, 70, 1) !important',
    '& button': {
      color: 'white !important',
    },
  },
  warning: {
    backgroundColor: 'rgba(171, 170, 0, 1) !important',
    '& button': {
      color: 'white !important',
    },
  },
  info: {
    backgroundColor: 'rgba(41, 46, 136, 1) !important',
    '& button': {
      color: 'white !important',
    },
  },
  root: {
    '& > div': {
      backgroundColor: 'rgba(183, 183, 183, 1)',
      color: 'black',
      '& button': {
        color: 'black',
      },
    },
  },
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const classes = useStyles();

  const notistackRef = React.createRef() as React.RefObject<SnackbarProvider>;
  const onClickDismiss = (key: React.ReactText) => () => {
    (notistackRef.current as any).closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
        root: classes.root,
      }}
      ref={notistackRef}
      maxSnack={5}
      hideIconVariant
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      action={(key) => <Button onClick={onClickDismiss(key)}>✕</Button>}
      // @ts-ignore
      TransitionComponent={Slide}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
