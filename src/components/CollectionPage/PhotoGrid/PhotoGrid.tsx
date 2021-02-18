import React from 'react';
import styles from './styles.module.scss';
import { PhotoGridProps } from '../../../types';
import { IconButton } from '@material-ui/core';

import { updatePhotoSelection } from '../../../firebase';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import MessageIcon from '@material-ui/icons/Message';

const PhotoGrid: React.FC<PhotoGridProps> = ({
  collectionId,
  collection,
  setCollection,
  filteredPhotos,
  openLightbox,
  openCommentModal,
}) => {
  const selectPhoto = (photoId: string) => (event: any) => {
    try {
      const clickedPhoto = collection?.photos.find(
        (photo) => photo.id === photoId
      );
      if (clickedPhoto && collection && setCollection && collectionId) {
        updatePhotoSelection(collectionId, photoId, !clickedPhoto.selected);
        clickedPhoto.selected = !clickedPhoto?.selected;
        setCollection({
          ...collection,
          photos: collection.photos.map((photo) =>
            photo.id === photoId ? clickedPhoto : photo
          ),
        });
      }
    } catch (err) {
      //
    }
  };

  return (
    <div className={styles.photoGrid}>
      {filteredPhotos.map((photo, index) => {
        return (
          <div className={styles.photoThumbnailGrid} key={photo.id}>
            <div className={styles.imgBorder}>
              <picture>
                <source srcSet={photo.thumbnailWebp} type='image/webp' />
                <img
                  src={photo.thumbnail}
                  alt={collection.title}
                  onClick={() => openLightbox(Number(index))}
                />
              </picture>
              {collection.status === 'selecting' ? (
                <div>
                  {collection.allowComments ? (
                    <IconButton
                      aria-label='comment'
                      className={
                        photo.comment.length > 0
                          ? styles.commentBtnFilled
                          : styles.commentBtn
                      }
                      onClick={() => openCommentModal(index)}
                    >
                      {photo.comment.length > 0 ? (
                        <MessageIcon />
                      ) : (
                        <ChatBubbleOutlineIcon />
                      )}
                    </IconButton>
                  ) : null}
                  <IconButton
                    aria-label='select'
                    className={
                      photo.selected ? styles.starBtnSelected : styles.starBtn
                    }
                    onClick={selectPhoto(photo.id)}
                  >
                    {photo.selected ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </div>
              ) : (
                <div>
                  {photo.comment.length > 0 && collection.allowComments ? (
                    <IconButton
                      aria-label='comment'
                      className={styles.commentBtnFilled}
                      onClick={() => openCommentModal(index)}
                    >
                      <MessageIcon />
                    </IconButton>
                  ) : null}
                  {photo.selected ? (
                    <IconButton
                      aria-label='select'
                      className={styles.starBtnSelected}
                    >
                      <StarIcon />
                    </IconButton>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGrid;
