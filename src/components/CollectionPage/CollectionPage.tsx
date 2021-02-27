import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Collection, Photo } from '../../types';
import { getSingleCollection } from '../../firebase';
import {
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

import LockedView from './LockedView/LockedView';
import SelectionView from './SelectionView/SelectionView';

const CollectionPage: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [commentTextarea, setCommentTextarea] = useState('');
  const [commentOpen, setCommentOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getSingleCollection(collectionId)
      .then((collection) => {
        setCollection(collection);
        setFilteredPhotos(collection.photos);
      })
      .catch((err) => {
        history.push('/error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

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

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!lightboxOpen) {
      document.body.style.overflow = 'unset';
    }
  }, [lightboxOpen]);

  const changeFilter = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFilter(e.target.value as string);
  };

  const openCommentModal = (index?: number) => {
    setCommentOpen(true);
    if (filteredPhotos) {
      if (index) {
        setPhotoIndex(index);
        setCommentTextarea(filteredPhotos[index].comment);
      } else {
        setCommentTextarea(filteredPhotos[photoIndex].comment);
      }
    }
  };

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const selectedPhotos = collection?.photos.filter((photo) => photo.selected)
    .length;

  if (collection === null) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />.
      </Backdrop>
    );
  }

  return (
    <div>
      <Typography variant='h4'>
        {collection.title} {collection.status !== 'selecting' && <LockIcon />}
      </Typography>
      <Typography variant='h6'>Selected: {selectedPhotos}</Typography>
      {collection.minSelect.required && collection.maxSelect.required ? (
        <Typography>
          You must select from {collection.minSelect.goal} to{' '}
          {collection.maxSelect.goal} photos
        </Typography>
      ) : collection.minSelect.required && !collection.maxSelect.required ? (
        <Typography>
          You must select at least {collection.minSelect.goal} photos
        </Typography>
      ) : !collection.minSelect.required && collection.maxSelect.required ? (
        <Typography>
          You must select a maximum of {collection.maxSelect.goal} photos
        </Typography>
      ) : null}
      <FormControl>
        <InputLabel>Filter</InputLabel>
        <Select value={filter} onChange={changeFilter}>
          <MenuItem value={'all'}>All</MenuItem>
          <MenuItem value={'selected'}>Selected</MenuItem>
          <MenuItem value={'unselected'}>Unselected</MenuItem>
        </Select>
      </FormControl>
      {collection.photos.length === 0 ? (
        <div>no photos in collection</div>
      ) : filteredPhotos.length === 0 ? (
        <div>no photos in this filter</div>
      ) : null}
      {collection.status === 'selecting' ? (
        <SelectionView
          collection={collection}
          setCollection={setCollection}
          collectionId={collectionId}
          filteredPhotos={filteredPhotos}
          lightboxOpen={lightboxOpen}
          setLightboxOpen={setLightboxOpen}
          openLightbox={openLightbox}
          openCommentModal={openCommentModal}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          commentOpen={commentOpen}
          setCommentOpen={setCommentOpen}
          commentTextarea={commentTextarea}
          setCommentTextarea={setCommentTextarea}
          selectedPhotos={selectedPhotos}
        />
      ) : (
        <LockedView
          collection={collection}
          filteredPhotos={filteredPhotos}
          lightboxOpen={lightboxOpen}
          setLightboxOpen={setLightboxOpen}
          openLightbox={openLightbox}
          openCommentModal={openCommentModal}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          commentOpen={commentOpen}
          setCommentOpen={setCommentOpen}
          commentTextarea={commentTextarea}
        />
      )}
    </div>
  );
};

export default CollectionPage;
