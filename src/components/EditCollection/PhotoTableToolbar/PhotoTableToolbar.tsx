import React from 'react';
import styles from './styles.module.scss';
import { PhotoTableToolbarProps } from '../../../types';
import { deletePhotos, resetPhotos } from '../../../firebase';
import {
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import DeleteIcon from '@material-ui/icons/Delete';

import FilterButtons from '../../FilterButtons/FilterButtons';

const PhotoTableToolbar: React.FC<PhotoTableToolbarProps> = ({
  collectionId,
  collection,
  setCollection,
  setFilteredPhotos,
  setConfirmationDialogOpen,
  setConfirmationDialogTitle,
  setConfirmationDialogContentText,
  setConfirmationDialogAgree,
  setProgress,
  selected,
  setSelected,
  setAddPhotosDialogOpen,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const agreeDelete = async () => {
    try {
      await deletePhotos(collectionId, selected, setProgress);
      if (collection) {
        const removeDeleted = collection.photos
          .filter((photo) => {
            for (let id of selected) {
              if (photo.id === id) {
                return false;
              }
            }
            return true;
          })
          .map((photo, index) => {
            return { ...photo, index: index + 1 };
          });
        setCollection({
          ...collection,
          photos: removeDeleted,
        });
      }
      setSelected([]);
      resetDialog();
    } catch (err) {
      enqueueSnackbar('ERROR: Deleting photos failed', {
        variant: 'error',
      });
    }
  };

  const agreeResetPhotos = async () => {
    if (collection) {
      try {
        await resetPhotos(collectionId, collection.photos);
        setCollection({
          ...collection,
          photos: collection.photos.map((photo) => ({
            ...photo,
            selected: false,
            comment: '',
          })),
        });
        resetDialog();
      } catch (err) {
        enqueueSnackbar('ERROR: Resetting photos failed', {
          variant: 'error',
        });
      }
    }
  };

  const confirmDeletion = () => {
    setConfirmationDialogOpen(true);
    setConfirmationDialogTitle('Do you really want to delete these photos?');
    setConfirmationDialogContentText(
      'WARNING: Delete action cannot be reverted!'
    );
    setConfirmationDialogAgree(() => agreeDelete);
  };

  const confirmResetPhotos = () => {
    setConfirmationDialogOpen(true);
    setConfirmationDialogTitle(
      'Do you really want to reset all selections and comments?'
    );
    setConfirmationDialogContentText(
      'WARNING: Reset action cannot be reverted!'
    );
    setConfirmationDialogAgree(() => agreeResetPhotos);
  };

  const resetDialog = () => {
    setConfirmationDialogOpen(false);
    setConfirmationDialogTitle('');
    setConfirmationDialogContentText('');
    setConfirmationDialogAgree(() => {});
    setProgress(0);
  };

  return (
    <Toolbar>
      {selected.length > 0 ? (
        <div className={styles.toolbarSelected}>
          <Typography color='inherit' component='div'>
            {selected.length} to be deleted
          </Typography>
          <Tooltip title='Delete'>
            <IconButton aria-label='delete' onClick={confirmDeletion}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div className={styles.toolbarSelected}>
          {collection.status === 'editing' ? (
            <div className='horizontalButtons'>
              <Button
                onClick={() => {
                  setAddPhotosDialogOpen(true);
                }}
                variant='outlined'
              >
                Add photos
              </Button>
              <Button onClick={confirmResetPhotos} variant='outlined'>
                Reset selections and comments
              </Button>
            </div>
          ) : null}
        </div>
      )}
      <FilterButtons
        collection={collection}
        setFilteredPhotos={setFilteredPhotos}
      />
    </Toolbar>
  );
};

export default PhotoTableToolbar;
