import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@material-ui/core'

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'

import { LockedViewProps } from '../../../types'
import styles from './styles.module.scss'

import Lightbox from '../../Lightbox/Lightbox'
import CommentDialog from '../../CommentDialog/CommentDialog'
import PhotoGrid from '../PhotoGrid/PhotoGrid'
import { RootState } from '../../../store'

const LockedView: React.FC<LockedViewProps> = ({
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
  const filteredPhotos = useSelector((state: RootState) => state.singleCollection.filteredPhotos)
  const collection = useSelector((state: RootState) => state.singleCollection.collection)

  if (!collection) return null

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
            <IconButton aria-label="selectLighbox" disabled>
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
        disabled
      />
    </div>
  )
}

export default LockedView
