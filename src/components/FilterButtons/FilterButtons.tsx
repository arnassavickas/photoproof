import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { FilterButtonsProps, Photo } from '../../types';
import { Button, ButtonGroup } from '@material-ui/core';

const FilterButtons: React.FC<FilterButtonsProps> = ({
  collection,
  setFilteredPhotos,
  setLightboxOpen,
  photoIndex,
  setPhotoIndex,
}) => {
  const [filter, setFilter] = useState('all');

  const modifyLightbox = (photos: Photo[]) => {
    if (setLightboxOpen && photoIndex && setPhotoIndex) {
      if (photos.length === 0) {
        setLightboxOpen(false);
      } else if (photos.length <= photoIndex) {
        setPhotoIndex(photos.length - 1);
      }
    }
  };

  const photosCount = (() => {
    const all = collection.photos.length;
    const selected = collection.photos.filter((photo) => photo.selected).length;
    const notSelected = all - selected;
    return { all, selected, notSelected };
  })();

  useEffect(() => {
    if (collection) {
      switch (filter) {
        case 'all':
          return setFilteredPhotos(collection.photos);
        case 'selected':
          const selectedPhotos = collection.photos.filter(
            (photo) => photo.selected
          );
          modifyLightbox(selectedPhotos);
          return setFilteredPhotos(selectedPhotos);
        case 'unselected':
          const unselectedPhotos = collection.photos.filter(
            (photo) => !photo.selected
          );
          modifyLightbox(unselectedPhotos);
          return setFilteredPhotos(unselectedPhotos);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, collection]);

  return (
    <ButtonGroup
      className={styles.filterBtns}
      aria-label='outlined primary button group'
    >
      <Button
        variant={filter === 'selected' ? 'contained' : undefined}
        onClick={() => setFilter('selected')}
      >
        Selected &nbsp;&nbsp;{photosCount.selected}
      </Button>
      <Button
        variant={filter === 'all' ? 'contained' : undefined}
        onClick={() => setFilter('all')}
      >
        All &nbsp;&nbsp;{photosCount.all}
      </Button>
      <Button
        variant={filter === 'unselected' ? 'contained' : undefined}
        onClick={() => setFilter('unselected')}
      >
        Not Selected &nbsp;&nbsp;{photosCount.notSelected}
      </Button>
    </ButtonGroup>
  );
};

export default FilterButtons;
