import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useParams, useHistory } from 'react-router-dom';
import { Collection, Photo } from '../../types';
import { getSingleCollection } from '../../firebase';
import { Backdrop, CircularProgress, Typography } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

import LockedView from './LockedView/LockedView';
import SelectionView from './SelectionView/SelectionView';
import FilterButtons from '../FilterButtons/FilterButtons';

const CollectionPage: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
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
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  return (
    <div>
      <Typography variant='h4'>
        {collection.title} {collection.status !== 'selecting' && <LockIcon />}
      </Typography>
      <div>
        <div className={styles.horizontal}>
          <div className={styles.selectedDetails}>
            {collection.minSelect.required && collection.maxSelect.required ? (
              <Typography>
                You must select from {collection.minSelect.goal} to{' '}
                {collection.maxSelect.goal} photos
              </Typography>
            ) : collection.minSelect.required &&
              !collection.maxSelect.required ? (
              <Typography>
                You must select at least {collection.minSelect.goal} photos
              </Typography>
            ) : !collection.minSelect.required &&
              collection.maxSelect.required ? (
              <Typography>
                You must select a maximum of {collection.maxSelect.goal} photos
              </Typography>
            ) : null}
          </div>
          <FilterButtons
            collection={collection}
            setFilteredPhotos={setFilteredPhotos}
            modifyLightbox
            setLightboxOpen={setLightboxOpen}
            photoIndex={photoIndex}
            setPhotoIndex={setPhotoIndex}
          />
        </div>
      </div>
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
