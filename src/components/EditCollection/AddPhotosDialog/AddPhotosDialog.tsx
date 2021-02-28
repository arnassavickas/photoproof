import React from 'react';
import styles from './styles.module.scss';
import { AddPhotosDialogProps } from '../../../types';
import { getSingleCollection, addMorePhotos } from '../../../firebase';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Box,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { DropzoneArea } from 'material-ui-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { Fragment } from 'react';

const AddPhotosDialog: React.FC<AddPhotosDialogProps> = ({
  collectionId,
  setCollection,
  setProgress,
  addPhotosDialogOpen,
  setAddPhotosDialogOpen,
  progress,
}) => {
  const { handleSubmit, errors, control } = useForm<any>({
    defaultValues: { files: [] },
  });

  const onConfirmUpload = async (data: { files: FileList }) => {
    await addMorePhotos(collectionId, data.files, setProgress);
    setAddPhotosDialogOpen(false);
    setProgress(0);
    const collection = await getSingleCollection(collectionId);
    setCollection(collection);
  };

  return (
    <Dialog open={addPhotosDialogOpen}>
      <form onSubmit={handleSubmit(onConfirmUpload)}>
        <DialogTitle id='alert-dialog-title'>Add photos</DialogTitle>
        <IconButton
          onClick={() => setAddPhotosDialogOpen(false)}
          className={styles.exitBtn}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {progress ? (
            <Box p={'3px'}>
              <LinearProgress variant='determinate' value={progress} />
            </Box>
          ) : (
            <Box p={'5px'}></Box>
          )}
          <div className={styles.dropzoneError}>
            <Typography data-testid='error' variant='body1'>
              {errors.files ? (
                'Images are required'
              ) : (
                <Fragment>&#8203;</Fragment>
              )}
            </Typography>
          </div>
          <Controller
            name='files'
            control={control}
            rules={{
              validate: {
                notEmpty: (array) => {
                  return array.length > 0;
                },
              },
            }}
            render={({ onChange }) => (
              <DropzoneArea
                acceptedFiles={['image/jpeg']}
                dropzoneText={'Drop images or click to upload here'}
                onChange={(files) => {
                  return onChange([...files]);
                }}
                filesLimit={999}
                previewGridClasses={{
                  item: 'itemReference',
                }}
                previewGridProps={{
                  container: {
                    spacing: 1,
                  },
                  item: { sm: 2, lg: 2, md: 2 },
                }}
                showAlerts={false}
                showPreviewsInDropzone={false}
                showPreviews={true}
                showFileNamesInPreview={true}
                dropzoneClass={`${styles.dropzone} ${
                  errors.files && styles.dropzoneErrorBorder
                }`}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!!progress}
            onClick={() => setAddPhotosDialogOpen(false)}
            color='secondary'
          >
            Cancel
          </Button>
          <Button disabled={!!progress} color='primary' type='submit'>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPhotosDialog;
