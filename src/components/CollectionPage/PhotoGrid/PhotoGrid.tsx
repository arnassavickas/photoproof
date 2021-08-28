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
import { RootState } from '../../../store'
import { setCollection } from '../../../reducers/collectionSlice'

const PhotoGrid: React.FC<PhotoGridProps> = ({ openLightbox, openCommentModal }) => {
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const filteredPhotos = useSelector((state: RootState) => state.collection.filteredPhotos)
  const collection = useSelector((state: RootState) => state.collection.data)

  const selectPhoto = (photoId: string) => async () => {
    try {
      const clickedPhoto = collection.photos.find(photo => photo.id === photoId)

      if (clickedPhoto) {
        await updatePhotoSelection(collection.id, photoId, !clickedPhoto.selected)

        dispatch(
          setCollection({
            ...collection,
            photos: collection.photos.map(photo =>
              photo.id === photoId ? { ...photo, selected: !clickedPhoto.selected } : photo,
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
                    aria-label="select"
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
                    <IconButton aria-label="select" className={styles.heartBtnSelected} disabled>
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
