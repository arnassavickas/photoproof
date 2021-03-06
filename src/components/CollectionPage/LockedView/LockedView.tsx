import React from 'react';
import styles from './styles.module.scss';
import { LockedViewProps } from '../../../types';
import { IconButton } from '@material-ui/core';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import Lightbox from '../../Lightbox/Lightbox';
import CommentDialog from '../../CommentDialog/CommentDialog';
import PhotoGrid from '../PhotoGrid/PhotoGrid';

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
      <PhotoGrid
        collection={collection}
        filteredPhotos={filteredPhotos}
        openLightbox={openLightbox}
        openCommentModal={openCommentModal}
      />
      {filteredPhotos.length > 0 && (
        <Lightbox
          filteredPhotos={filteredPhotos}
          lightboxOpen={lightboxOpen}
          setLightboxOpen={setLightboxOpen}
          lightboxIndex={photoIndex}
          setLightboxIndex={setPhotoIndex}
          toolbarButtons={[
            <IconButton aria-label='selectLighbox' disabled>
              {filteredPhotos[photoIndex].selected ? (
                <FavoriteIcon className={styles.toolbarIcon} />
              ) : (
                <FavoriteBorderIcon className={styles.toolbarIcon} />
              )}
            </IconButton>,
            collection.allowComments ? (
              <IconButton
                aria-label='commentLightbox'
                onClick={() => openCommentModal()}
              >
                {filteredPhotos[photoIndex].comment.length > 0 ? (
                  <ChatBubbleIcon className={styles.toolbarIcon} />
                ) : (
                  <ChatBubbleOutlineIcon className={styles.toolbarIcon} />
                )}
              </IconButton>
            ) : null,
          ]}
        />
      )}
      <CommentDialog
        commentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
        commentTextarea={commentTextarea}
        disabled={true}
      />
    </div>
  );
};

export default LockedView;
