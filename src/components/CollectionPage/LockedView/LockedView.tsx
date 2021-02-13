import React from 'react';
import styles from './styles.module.scss';
import { LockedViewProps } from '../../../types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import MessageIcon from '@material-ui/icons/Message';

import Lightbox from '../../Lightbox/Lightbox';

const LockedView: React.FC<LockedViewProps> = ({
  collection,
  filteredPhotos,
  lightboxOpen,
  setLightboxOpen,
  openLightbox,
  openCommentModal,
  photoIndex,
  setPhotoIndex,
  commentOpen,
  setCommentOpen,
  commentTextarea,
}) => {
  return (
    <div>
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
                    onClick={openLightbox(Number(index))}
                  />
                </picture>
                {photo.comment.length > 0 && collection.allowComments ? (
                  <IconButton
                    className={styles.commentBtnFilled}
                    onClick={() => openCommentModal(index)}
                  >
                    <MessageIcon />
                  </IconButton>
                ) : null}
                {photo.selected ? (
                  <IconButton className={styles.starBtnSelected}>
                    <StarIcon />
                  </IconButton>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {lightboxOpen && filteredPhotos.length > 0 && (
        <Lightbox
          filteredPhotos={filteredPhotos}
          setLightboxOpen={setLightboxOpen}
          lightboxIndex={photoIndex}
          setLightboxIndex={setPhotoIndex}
          toolbarButtons={[
            <IconButton>
              {filteredPhotos[photoIndex].selected ? (
                <StarIcon className={styles.toolbarIcon} />
              ) : (
                <StarBorderIcon className={styles.toolbarIcon} />
              )}
            </IconButton>,
            collection.allowComments ? (
              <IconButton onClick={() => openCommentModal()}>
                {filteredPhotos[photoIndex].comment.length > 0 ? (
                  <MessageIcon className={styles.toolbarIcon} />
                ) : (
                  <ChatBubbleOutlineIcon className={styles.toolbarIcon} />
                )}
              </IconButton>
            ) : null,
          ]}
        />
      )}
      <Dialog open={commentOpen} onClose={() => setCommentOpen(false)}>
        <DialogTitle id='alert-dialog-title'>Comment</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            variant='outlined'
            value={commentTextarea}
            disabled
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockedView;
