import React, { useState } from 'react';
import styles from './styles.module.scss';
import { SelectionViewProps } from '../../../types';
import { updatePhotoSelection, updatePhotoComment } from '../../../firebase';
import { IconButton, Button } from '@material-ui/core';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import MessageIcon from '@material-ui/icons/Message';

import Lightbox from '../../Lightbox/Lightbox';
import CommentDialog from '../../CommentDialog/CommentDialog';
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import ConfirmationForbiddenDialog from './ConfirmationForbiddenDialog/ConfirmationForbiddenDialog';
import SelectionConfirmationDialog from './SelectionConfirmationDialog/SelectionConfirmationDialog';

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

  const selectPhotoLightbox = () => {
    if (filteredPhotos && collection) {
      try {
        const clickedPhoto = filteredPhotos[photoIndex];
        if (clickedPhoto && collection) {
          updatePhotoSelection(
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
        console.error(err);
      }
    }
  };

  const savePhotoComment = () => {
    setCommentOpen(false);
    if (filteredPhotos && collection) {
      try {
        const clickedPhoto = filteredPhotos[photoIndex];
        if (clickedPhoto && collection) {
          updatePhotoComment(collectionId, clickedPhoto.id, commentTextarea);
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
      {lightboxOpen && filteredPhotos.length > 0 && (
        <Lightbox
          filteredPhotos={filteredPhotos}
          setLightboxOpen={setLightboxOpen}
          lightboxIndex={photoIndex}
          setLightboxIndex={setPhotoIndex}
          toolbarButtons={[
            <IconButton onClick={selectPhotoLightbox}>
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

      <CommentDialog
        commentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
        commentTextarea={commentTextarea}
        setCommentTextarea={setCommentTextarea}
        disabled={true}
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
        Confirm selections
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
