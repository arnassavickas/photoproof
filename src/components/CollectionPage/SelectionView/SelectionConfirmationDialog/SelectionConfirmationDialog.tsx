import React from 'react';
import styles from './styles.module.scss';
import { SelectionConfirmationDialogProps } from '../../../../types';
import { confirmCollection } from '../../../../firebase';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  DialogContentText,
} from '@material-ui/core';

import { useForm } from 'react-hook-form';

const SelectionConfirmationDialog: React.FC<SelectionConfirmationDialogProps> = ({
  collection,
  setCollection,
  collectionId,
  selectedPhotos,
  confirmDialogOpen,
  setConfirmDialogOpen,
}) => {
  const { register, handleSubmit } = useForm<any>({
    defaultValues: { files: [] },
  });

  const confirmSelections = async (data: { finalComment: string }) => {
    console.log(data);
    await confirmCollection(collectionId, data.finalComment);
    setConfirmDialogOpen(false);
    setCollection({
      ...collection,
      status: 'confirmed',
      finalComment: data.finalComment,
    });
  };

  return (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
    >
      <form onSubmit={handleSubmit(confirmSelections)}>
        <DialogTitle id='alert-dialog-title'>Confirm selections</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected <strong>{selectedPhotos} photos</strong>.
          </DialogContentText>
          <DialogContentText>
            Do you want to leave a final comment?
          </DialogContentText>
          <TextField
            multiline
            rows={3}
            fullWidth
            variant='outlined'
            placeholder='Final comment'
            name='finalComment'
            inputRef={register}
          />
          <DialogContentText>
            <strong>Warning:</strong> you will not be able to select more photos
            after confirming!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            color='secondary'
            autoFocus
          >
            Cancel
          </Button>
          <Button type='submit' color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SelectionConfirmationDialog;
