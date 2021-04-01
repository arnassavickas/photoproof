import React, { useState } from 'react';
import styles from './styles.module.scss';
import { SelectionViewProps } from '../../../types';
import { updatePhotoSelection, updatePhotoComment } from '../../../firebase';
import { IconButton, Button } from '@material-ui/core';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import MessageIcon from '@material-ui/icons/Message';

import Lightbox from '../../Lightbox/Lightbox';
import CommentDialog from '../../CommentDialog/CommentDialog';
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import ConfirmationForbiddenDialog from './ConfirmationForbiddenDialog/ConfirmationForbiddenDialog';
import SelectionConfirmationDialog from './SelectionConfirmationDialog/SelectionConfirmationDialog';

import { useSnackbar } from 'notistack';

const SelectionView: React.FC<SelectionViewProps> = ({
  collection,
  setCollection,
  collectionId,
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
  setCommentTextarea,
  selectedPhotos,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmForbidDialogOpen, setConfirmForbidDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const selectPhotoLightbox = async () => {
    if (filteredPhotos && collection) {
      try {
        const clickedPhoto = filteredPhotos[photoIndex];
        if (clickedPhoto && collection) {
          await updatePhotoSelection(
            collectionId,
            clickedPhoto.id,
            !clickedPhoto.selected
          );
          clickedPhoto.selected = !clickedPhoto?.selected;
          setCollection({
            ...collection,
            photos: collection.photos.map((photo) =>
              photo.id === clickedPhoto.id ? clickedPhoto : photo
            ),
          });
        }
      } catch (err) {
        enqueueSnackbar('ERROR: Photo selection failed', {
          variant: 'error',
        });
      }
    }
  };

  const savePhotoComment = async () => {
    setCommentOpen(false);
    if (filteredPhotos && collection) {
      try {
        const clickedPhoto = filteredPhotos[photoIndex];
        if (clickedPhoto && collection) {
          await updatePhotoComment(collectionId, clickedPhoto.id, commentTextarea);
          clickedPhoto.comment = commentTextarea;
          setCollection({
            ...collection,
            photos: collection.photos.map((photo) =>
              photo.id === clickedPhoto.id ? clickedPhoto : photo
            ),
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <PhotoGrid
        collectionId={collectionId}
        collection={collection}
        setCollection={setCollection}
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
            <IconButton
              aria-label='selectLighbox'
              onClick={selectPhotoLightbox}
            >
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
                  <MessageIcon className={styles.toolbarIcon} />
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
        setCommentTextarea={setCommentTextarea}
        disabled={!collection.allowComments}
        actionButtons={[
          <Button
            key={'cancel'}
            onClick={() => setCommentOpen(false)}
            color='secondary'
            autoFocus
          >
            Cancel
          </Button>,
          <Button key={'save'} onClick={savePhotoComment} color='primary'>
            Save
          </Button>,
        ]}
      />

      <Button
        variant='contained'
        classes={{ root: styles.fixedBtn }}
        onClick={() => {
          if (selectedPhotos != null) {
            if (
              (collection.minSelect.required &&
                selectedPhotos < collection.minSelect.goal) ||
              (collection.maxSelect.required &&
                selectedPhotos > collection.maxSelect.goal)
            ) {
              return setConfirmForbidDialogOpen(true);
            }
            return setConfirmDialogOpen(true);
          }
        }}
      >
        confirm {selectedPhotos} selections
      </Button>

      <ConfirmationForbiddenDialog
        collection={collection}
        selectedPhotos={selectedPhotos}
        confirmForbidDialogOpen={confirmForbidDialogOpen}
        setConfirmForbidDialogOpen={setConfirmForbidDialogOpen}
      />

      <SelectionConfirmationDialog
        collection={collection}
        setCollection={setCollection}
        collectionId={collectionId}
        selectedPhotos={selectedPhotos}
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />
    </div>
  );
};

export default SelectionView;
