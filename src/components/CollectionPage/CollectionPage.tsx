import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography } from '@material-ui/core'

import LockIcon from '@material-ui/icons/Lock'

import styles from './styles.module.scss'
import { getSingleCollection } from '../../firebase'

import LockedView from './LockedView/LockedView'
import SelectionView from './SelectionView/SelectionView'
import FilterButtons from '../FilterButtons/FilterButtons'
import { RootState } from '../../store'
import { setCollection } from '../../reducers/collectionSlice'
import { setUiState } from '../../reducers/uiStateSlice'
import { UiState } from '../../types'

const CollectionPage: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [commentTextarea, setCommentTextarea] = useState('')
  const [commentOpen, setCommentOpen] = useState(false)
  const history = useHistory()

  const dispatch = useDispatch()
  const filteredPhotos = useSelector((state: RootState) => state.collection.filteredPhotos)
  const collection = useSelector((state: RootState) => state.collection.data)

  useEffect(() => {
    getSingleCollection(collectionId)
      .then(collection => {
        dispatch(setCollection(collection))
      })
      .catch(() => {
        dispatch(setUiState(UiState.Idle))
        history.push('/error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId])

  const openCommentModal = (index?: number) => {
    setCommentOpen(true)
    if (filteredPhotos) {
      if (index) {
        setPhotoIndex(index)
        setCommentTextarea(filteredPhotos[index].comment)
      } else {
        setCommentTextarea(filteredPhotos[photoIndex].comment)
      }
    }
  }

  const openLightbox = (index: number) => {
    setPhotoIndex(index)
    setLightboxOpen(true)
  }

  const selectedPhotos = collection?.photos.filter(photo => photo.selected).length

  const renderMustMessage = () => {
    if (collection.minSelect.required && collection.maxSelect.required) {
      return (
        <Typography>
          You must select from {collection.minSelect.goal} to {collection.maxSelect.goal} photos
        </Typography>
      )
    }

    if (collection.minSelect.required && !collection.maxSelect.required) {
      return <Typography>You must select at least {collection.minSelect.goal} photos</Typography>
    }

    if (!collection.minSelect.required && collection.maxSelect.required) {
      return (
        <Typography>You must select a maximum of {collection.maxSelect.goal} photos</Typography>
      )
    }

    return null
  }

  const renderWarningMessage = () => {
    if (collection.photos.length === 0) {
      return <div>no photos in collection</div>
    }

    if (filteredPhotos.length === 0) {
      return <div>no photos in this filter</div>
    }

    return null
  }

  return (
    <div>
      <Typography variant="h4">
        {collection.title} {collection.status !== 'selecting' && <LockIcon />}
      </Typography>
      <div>
        <div className={styles.horizontal}>
          <div className={styles.selectedDetails}>{renderMustMessage()}</div>
          <FilterButtons
            modifyLightbox
            setLightboxOpen={setLightboxOpen}
            photoIndex={photoIndex}
            setPhotoIndex={setPhotoIndex}
          />
        </div>
      </div>
      {renderWarningMessage()}
      {collection.status === 'selecting' ? (
        <SelectionView
          collectionId={collectionId}
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
  )
}

export default CollectionPage
