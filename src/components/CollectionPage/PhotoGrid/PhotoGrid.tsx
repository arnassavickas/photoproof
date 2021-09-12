import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@material-ui/core'

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'

import Masonry from 'react-masonry-css'

import { useSnackbar } from 'notistack'

import { updatePhotoSelection } from '../../../firebase'
import { PhotoGridProps } from '../../../types'
import styles from './styles.module.scss'
import { setPhotoSelection } from '../../../reducers/collectionsSlice'
import { getCurrentCollection, getFilteredPhotos } from '../../../reducers/collectionsSelectors'

const PhotoGrid: React.FC<PhotoGridProps> = ({ openLightbox, openCommentModal }) => {
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const filteredPhotos = useSelector(getFilteredPhotos())
  const collection = useSelector(getCurrentCollection())

  if (!collection) return null

  const selectPhoto = (photoId: string) => async () => {
    try {
      const clickedPhoto = collection.photos.find(photo => photo.id === photoId)

      if (clickedPhoto) {
        await updatePhotoSelection(collection.id, photoId, !clickedPhoto.selected)

        dispatch(setPhotoSelection(clickedPhoto.id))
      }
    } catch (err) {
      enqueueSnackbar('ERROR: Photo selection failed', {
        variant: 'error',
      })
    }
  }

  const breakpointColumns = {
    default: 5,
    1600: 4,
    1100: 3,
    700: 2,
    430: 1,
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={styles.masonryGrid}
      columnClassName={styles.masonryGridColumn}
    >
      {filteredPhotos.map((photo, index) => {
        return (
          <div className={styles.photoThumbnailGrid} key={photo.id}>
            <div className={styles.imgBorder}>
              <picture>
                <source srcSet={photo.thumbnailWebp} type="image/webp" />
                <img
                  src={photo.thumbnail}
                  alt={collection.title}
                  onClick={() => openLightbox(Number(index))}
                />
              </picture>
              <div className={styles.photoIndex}>{photo.index}</div>
              {collection.status === 'selecting' ? (
                <div>
                  {collection.allowComments ? (
                    <IconButton
                      aria-label="comment"
                      className={
                        photo.comment.length > 0 ? styles.commentBtnFilled : styles.commentBtn
                      }
                      onClick={() => openCommentModal(index)}
                    >
                      {photo.comment.length > 0 ? <ChatBubbleIcon /> : <ChatBubbleOutlineIcon />}
                    </IconButton>
                  ) : null}
                  <IconButton
                    data-testid="select-btn"
                    className={photo.selected ? styles.heartBtnSelected : styles.heartBtn}
                    onClick={selectPhoto(photo.id)}
                  >
                    {photo.selected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </div>
              ) : (
                <div>
                  {photo.comment.length > 0 && collection.allowComments ? (
                    <IconButton
                      aria-label="comment"
                      className={styles.commentBtnFilled}
                      onClick={() => openCommentModal(index)}
                    >
                      <ChatBubbleIcon />
                    </IconButton>
                  ) : null}
                  {photo.selected ? (
                    <IconButton
                      data-testid="select-btn"
                      className={styles.heartBtnSelected}
                      disabled
                    >
                      <FavoriteIcon />
                    </IconButton>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </Masonry>
  )
}

export default PhotoGrid
