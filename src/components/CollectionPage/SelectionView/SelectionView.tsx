import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import { IconButton, Button } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'

import styles from './styles.module.scss'
import { SelectionViewProps } from '../../../types'
import { updatePhotoSelection, updatePhotoComment } from '../../../firebase'

import Lightbox from '../../Lightbox/Lightbox'
import CommentDialog from '../../CommentDialog/CommentDialog'
import PhotoGrid from '../PhotoGrid/PhotoGrid'
import ConfirmationForbiddenDialog from './ConfirmationForbiddenDialog/ConfirmationForbiddenDialog'
import SelectionConfirmationDialog from './SelectionConfirmationDialog/SelectionConfirmationDialog'
import { RootState } from '../../../store'
import { setCollection } from '../../../reducers/collectionsSlice'

const SelectionView: React.FC<SelectionViewProps> = ({
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmForbidDialogOpen, setConfirmForbidDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const filteredPhotos = useSelector((state: RootState) => state.collections.filteredPhotos)
  const collection = useSelector((state: RootState) => state.collections.collection)

  const selectPhotoLightbox = async () => {
    if (filteredPhotos && collection) {
      try {
        const clickedPhoto = filteredPhotos[photoIndex]
        if (clickedPhoto && collection) {
          await updatePhotoSelection(collection.id, clickedPhoto.id, !clickedPhoto.selected)
          clickedPhoto.selected = !clickedPhoto?.selected
          dispatch(
            setCollection({
              ...collection,
              photos: collection.photos.map(photo =>
                photo.id === clickedPhoto.id ? clickedPhoto : photo,
              ),
            }),
          )
        }
      } catch (err) {
        enqueueSnackbar('ERROR: Photo selection failed', {
          variant: 'error',
        })
      }
    }
  }

  const keySelect = (event: any) => {
    if (!lightboxOpen) {
      return
    }

    if (event.code === 'ArrowUp' && !filteredPhotos[photoIndex].selected) {
      selectPhotoLightbox()
    } else if (event.code === 'ArrowDown' && filteredPhotos[photoIndex].selected) {
      selectPhotoLightbox()
    }
  }

  useEffect(() => {
    if (lightboxOpen) {
      const reactPortal = document.querySelector('.ReactModalPortal')
      if (reactPortal) {
        reactPortal.addEventListener('keyup', keySelect)
        return () => reactPortal.removeEventListener('keyup', keySelect)
      }
    }

    return () => null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, photoIndex])

  if (!collection) return null

  const savePhotoComment = async () => {
    setCommentOpen(false)
    if (filteredPhotos && collection) {
      try {
        const clickedPhoto = filteredPhotos[photoIndex]
        if (clickedPhoto && collection) {
          await updatePhotoComment(collection.id, clickedPhoto.id, commentTextarea)
          clickedPhoto.comment = commentTextarea
          setCollection({
            ...collection,
            photos: collection.photos.map(photo =>
              photo.id === clickedPhoto.id ? clickedPhoto : photo,
            ),
          })
        }
      } catch (err) {
        enqueueSnackbar('ERROR: Photo commenting failed', {
          variant: 'error',
        })
      }
    }
  }

  return (
    <div>
      <PhotoGrid openLightbox={openLightbox} openCommentModal={openCommentModal} />
      {filteredPhotos.length > 0 && (
        <Lightbox
          lightboxOpen={lightboxOpen}
          setLightboxOpen={setLightboxOpen}
          lightboxIndex={photoIndex}
          setLightboxIndex={setPhotoIndex}
          toolbarButtons={[
            <IconButton aria-label="selectLighbox" onClick={selectPhotoLightbox}>
              {filteredPhotos[photoIndex].selected ? (
                <FavoriteIcon className={styles.toolbarIcon} />
              ) : (
                <FavoriteBorderIcon className={styles.toolbarIcon} />
              )}
            </IconButton>,
            collection.allowComments ? (
              <IconButton aria-label="commentLightbox" onClick={() => openCommentModal()}>
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
        setCommentTextarea={setCommentTextarea}
        disabled={!collection.allowComments}
        actionButtons={[
          <Button key="cancel" onClick={() => setCommentOpen(false)} color="secondary" autoFocus>
            Cancel
          </Button>,
          <Button key="save" onClick={savePhotoComment} color="primary">
            Save
          </Button>,
        ]}
      />

      <Button
        variant="contained"
        classes={{ root: styles.fixedBtn }}
        onClick={() => {
          if (selectedPhotos != null) {
            if (
              (collection.minSelect.required && selectedPhotos < collection.minSelect.goal) ||
              (collection.maxSelect.required && selectedPhotos > collection.maxSelect.goal)
            ) {
              return setConfirmForbidDialogOpen(true)
            }
            return setConfirmDialogOpen(true)
          }
          return null
        }}
      >
        confirm {selectedPhotos} selections
      </Button>

      <ConfirmationForbiddenDialog
        selectedPhotos={selectedPhotos}
        confirmForbidDialogOpen={confirmForbidDialogOpen}
        setConfirmForbidDialogOpen={setConfirmForbidDialogOpen}
      />

      <SelectionConfirmationDialog
        selectedPhotos={selectedPhotos}
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
      />
    </div>
  )
}

export default SelectionView
