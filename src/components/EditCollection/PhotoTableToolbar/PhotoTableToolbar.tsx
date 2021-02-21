import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { PhotoTableToolbarProps } from '../../../types';
import { deletePhotos, resetPhotos } from '../../../firebase';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Button,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

const PhotoTableToolbar: React.FC<PhotoTableToolbarProps> = ({
  collectionId,
  collection,
  setCollection,
  filteredPhotos,
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
  const [filter, setFilter] = useState('all');

  const changeFilter = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFilter(e.target.value as string);
  };

  useEffect(() => {
    if (collection) {
      switch (filter) {
        case 'all':
          return setFilteredPhotos(collection.photos);
        case 'selected':
          const selectedPhotos = collection.photos.filter(
            (photo) => photo.selected
          );
          return setFilteredPhotos(selectedPhotos);
        case 'unselected':
          const unselectedPhotos = collection.photos.filter(
            (photo) => !photo.selected
          );
          return setFilteredPhotos(unselectedPhotos);
      }
    }
  }, [filter, collection, setFilteredPhotos]);

  const agreeDelete = async () => {
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
        //
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
            <div>
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
      <FormControl className={styles.toolbarFilter}>
        <InputLabel id='filter'>Filter</InputLabel>
        <Select labelId='filter' value={filter} onChange={changeFilter}>
          <MenuItem value={'all'}>All</MenuItem>
          <MenuItem value={'selected'}>Selected</MenuItem>
          <MenuItem value={'unselected'}>Unselected</MenuItem>
        </Select>
      </FormControl>
    </Toolbar>
  );
};

export default PhotoTableToolbar;
