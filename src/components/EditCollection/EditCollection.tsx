import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Backdrop, CircularProgress, IconButton } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import StarBorderIcon from '@material-ui/icons/StarBorder'

import MessageIcon from '@material-ui/icons/Message'

import { useSnackbar } from 'notistack'

import styles from './styles.module.scss'
import { UiState } from '../../types'
import { getSingleCollection } from '../../firebase'

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog'

import CollectionDetails from './CollectionDetails/CollectionDetails'
import PhotoTableToolbar from './PhotoTableToolbar/PhotoTableToolbar'
import PhotoTable from './PhotoTable/PhotoTable'
import AddPhotosDialog from './AddPhotosDialog/AddPhotosDialog'
import Lightbox from '../Lightbox/Lightbox'
import CommentDialog from '../CommentDialog/CommentDialog'
import { setCollection } from '../../reducers/collectionSlice'
import { setUiState } from '../../reducers/uiStateSlice'
import { RootState } from '../../store'

const EditCollection: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>()

  const dispatch = useDispatch()
  const uiState = useSelector((state: RootState) => state.uiState.value)
  const filteredPhotos = useSelector((state: RootState) => state.collection.filteredPhotos)
  const collection = useSelector((state: RootState) => state.collection.data)

  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('')
  const [confirmationDialogContentText, setConfirmationDialogContentText] = useState('')
  const [confirmationDialogAgree, setConfirmationDialogAgree] = useState<(value: any) => void>(
    () => {
      //
    },
  )
  const [progress, setProgress] = useState(0)
  const [addPhotosDialogOpen, setAddPhotosDialogOpen] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentTextarea, setCommentTextarea] = useState('')

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (collection.id !== collectionId) {
      getSingleCollection(collectionId)
        .then(collection => {
          dispatch(setCollection(collection))
          dispatch(setUiState(UiState.Success))
        })
        .catch(() => {
          enqueueSnackbar('ERROR: Getting collection failed', {
            variant: 'error',
          })
          dispatch(setUiState(UiState.Idle))
        })
    }
  }, [collection.id, collectionId, dispatch, enqueueSnackbar])

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

  if (uiState === UiState.Pending) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <div>
      <CollectionDetails
        collectionId={collectionId}
        setConfirmationDialogOpen={setConfirmationDialogOpen}
        setConfirmationDialogTitle={setConfirmationDialogTitle}
        setConfirmationDialogContentText={setConfirmationDialogContentText}
        setConfirmationDialogAgree={setConfirmationDialogAgree}
        setProgress={setProgress}
      />
      <PhotoTableToolbar
        collectionId={collectionId}
        setConfirmationDialogOpen={setConfirmationDialogOpen}
        setConfirmationDialogTitle={setConfirmationDialogTitle}
        setConfirmationDialogContentText={setConfirmationDialogContentText}
        setConfirmationDialogAgree={setConfirmationDialogAgree}
        setProgress={setProgress}
        selected={selected}
        setSelected={setSelected}
        setAddPhotosDialogOpen={setAddPhotosDialogOpen}
      />
      <PhotoTable
        selected={selected}
        setSelected={setSelected}
        setPhotoIndex={setPhotoIndex}
        setLightboxOpen={setLightboxOpen}
      />
      {filteredPhotos.length > 0 && (
        <Lightbox
          lightboxOpen={lightboxOpen}
          setLightboxOpen={setLightboxOpen}
          lightboxIndex={photoIndex}
          setLightboxIndex={setPhotoIndex}
          toolbarButtons={[
            filteredPhotos[photoIndex].comment.length > 0 ? (
              <IconButton className={styles.toolbarIcon} onClick={() => openCommentModal()}>
                <MessageIcon />
              </IconButton>
            ) : (
              <div className={styles.toolbarIcon} />
            ),
            filteredPhotos[photoIndex].selected ? (
              <IconButton className={styles.toolbarIcon} disabled>
                <StarBorderIcon />
              </IconButton>
            ) : (
              <div className={styles.toolbarIcon} />
            ),
          ]}
        />
      )}
      <ConfirmationDialog
        dialogOpen={confirmationDialogOpen}
        progress={progress}
        onClickCancel={() => setConfirmationDialogOpen(false)}
        onClickAgree={confirmationDialogAgree}
        dialogTitle={confirmationDialogTitle}
        dialogContentText={confirmationDialogContentText}
      />
      <AddPhotosDialog
        collectionId={collectionId}
        setProgress={setProgress}
        addPhotosDialogOpen={addPhotosDialogOpen}
        setAddPhotosDialogOpen={setAddPhotosDialogOpen}
        progress={progress}
      />
      <CommentDialog
        commentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
        commentTextarea={commentTextarea}
        disabled
      />
    </div>
  )
}

export default EditCollection
