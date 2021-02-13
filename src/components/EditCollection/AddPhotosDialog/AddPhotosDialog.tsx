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
} from '@material-ui/core';

import { DropzoneArea } from 'material-ui-dropzone';
import { useForm, Controller } from 'react-hook-form';

const AddPhotosDialog: React.FC<AddPhotosDialogProps> = ({
  collectionId,
  setCollection,
  setProgress,
  addPhotosDialogOpen,
  setAddPhotosDialogOpen,
  progress,
}) => {
  const {
    handleSubmit: handleSubmitFiles,
    //TODO add error if no files added to upload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errors: errorsFiles,
    control: controlFiles,
  } = useForm<any>({
    defaultValues: { files: [] },
  });

  const onConfirmUpload = async (data: { files: FileList }) => {
    console.log(data);
    await addMorePhotos(collectionId, data.files, setProgress);
    setAddPhotosDialogOpen(false);
    setProgress(0);
    const collection = await getSingleCollection(collectionId);
    setCollection(collection);
  };

  return (
    <Dialog open={addPhotosDialogOpen}>
      <form onSubmit={handleSubmitFiles(onConfirmUpload)}>
        <DialogTitle id='alert-dialog-title'>Add photos</DialogTitle>
        <DialogContent>
          {progress ? (
            <Box p={'3px'}>
              <LinearProgress variant='determinate' value={progress} />
            </Box>
          ) : (
            <Box p={'5px'}></Box>
          )}
          <Controller
            name='files'
            control={controlFiles}
            render={({ onChange }) => (
              <DropzoneArea
                acceptedFiles={['image/jpeg']}
                dropzoneText={'Drop images or click to upload here'}
                onChange={(files) => {
                  return onChange([...files]);
                }}
                filesLimit={999}
                previewGridClasses={{
                  container: styles.previewContainer,
                  item: `${styles.previewItem} itemReference`,
                  image: styles.previewImage,
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
                dropzoneClass={styles.dropzone}
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
            Yes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPhotosDialog;
