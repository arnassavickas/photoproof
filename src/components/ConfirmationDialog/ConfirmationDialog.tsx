import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  LinearProgress,
  DialogActions,
  Button,
} from '@material-ui/core';

interface ConfirmationDialogProps {
  dialogOpen: boolean;
  progress?: number;
  onClickCancel: React.MouseEventHandler<HTMLButtonElement>;
  onClickAgree: React.MouseEventHandler<HTMLButtonElement>;
  dialogTitle: string;
  dialogContentText: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogOpen,
  progress,
  onClickCancel,
  onClickAgree,
  dialogTitle,
  dialogContentText,
}) => {
  return (
    <Dialog open={dialogOpen}>
      <DialogTitle id='alert-dialog-title'>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {dialogContentText}
        </DialogContentText>
        {progress ? (
          <LinearProgress variant='determinate' value={progress} />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!!progress}
          onClick={onClickCancel}
          color='primary'
          autoFocus
        >
          Cancel
        </Button>
        <Button disabled={!!progress} onClick={onClickAgree} color='secondary'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
