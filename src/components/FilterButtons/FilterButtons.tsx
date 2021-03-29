import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FilterButtonsProps } from '../../types';
import {
  Backdrop,
  Button,
  ButtonGroup,
  CircularProgress,
} from '@material-ui/core';

const FilterButtons: React.FC<FilterButtonsProps> = ({
  collection,
  setFilteredPhotos,
  setLightboxOpen,
  photoIndex,
  setPhotoIndex,
}) => {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (collection) {
      switch (filter) {
        case 'all':
          return setFilteredPhotos(collection.photos);
        case 'selected':
          const selectedPhotos = collection.photos.filter(
            (photo) => photo.selected
          );
          if (selectedPhotos.length === 0) {
            setLightboxOpen(false);
          } else if (selectedPhotos.length <= photoIndex) {
            setPhotoIndex(selectedPhotos.length - 1);
          }
          return setFilteredPhotos(selectedPhotos);
        case 'unselected':
          const unselectedPhotos = collection.photos.filter(
            (photo) => !photo.selected
          );
          if (unselectedPhotos.length === 0) {
            setLightboxOpen(false);
          } else if (unselectedPhotos.length <= photoIndex) {
            setPhotoIndex(unselectedPhotos.length - 1);
          }

          return setFilteredPhotos(unselectedPhotos);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, collection]);

  if (collection === null) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />.
      </Backdrop>
    );
  }

  return (
    <ButtonGroup
      className={styles.filterBtns}
      aria-label='outlined primary button group'
    >
      <Button
        variant={filter === 'selected' ? 'contained' : undefined}
        onClick={() => setFilter('selected')}
      >
        Selected
      </Button>
      <Button
        variant={filter === 'all' ? 'contained' : undefined}
        onClick={() => setFilter('all')}
      >
        All
      </Button>
      <Button
        variant={filter === 'unselected' ? 'contained' : undefined}
        onClick={() => setFilter('unselected')}
      >
        Not Selected
      </Button>
    </ButtonGroup>
  );
};

export default FilterButtons;
