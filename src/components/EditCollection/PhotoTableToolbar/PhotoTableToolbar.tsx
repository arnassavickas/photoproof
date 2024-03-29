/* eslint-disable no-restricted-syntax */
import React from 'react'
import { Toolbar, IconButton, Typography, Tooltip, Button } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { noop } from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'

import styles from './styles.module.scss'
import { PhotoTableToolbarProps } from '../../../types'
import { deletePhotos, resetPhotos } from '../../../firebase'

import FilterButtons from '../../FilterButtons/FilterButtons'
import { setCollection } from '../../../reducers/collectionsSlice'
import { setLoaderProgress } from '../../../reducers/uiStateSlice'
import { getCurrentCollection } from '../../../reducers/collectionsSelectors'

const PhotoTableToolbar: React.FC<PhotoTableToolbarProps> = ({
  setConfirmationDialogOpen,
  setConfirmationDialogTitle,
  setConfirmationDialogContentText,
  setConfirmationDialogAgree,
  selected,
  setSelected,
  setAddPhotosDialogOpen,
}) => {
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const collection = useSelector(getCurrentCollection())

  if (!collection) return null

  const resetDialog = () => {
    setConfirmationDialogOpen(false)
    setConfirmationDialogTitle('')
    setConfirmationDialogContentText('')
    setConfirmationDialogAgree(noop)

    dispatch(setLoaderProgress(0))
  }

  const handleLoaderProgressChange = (progress: number) => {
    dispatch(setLoaderProgress(progress))
  }

  const agreeDelete = async () => {
    try {
      await deletePhotos(collection.id, selected, handleLoaderProgressChange)
      const removeDeleted = collection.photos
        .filter(photo => {
          for (const id of selected) {
            if (photo.id === id) {
              return false
            }
          }
          return true
        })
        .map((photo, index) => {
          return { ...photo, index: index + 1 }
        })

      dispatch(
        setCollection({
          ...collection,
          photos: removeDeleted,
        }),
      )

      setSelected([])
      resetDialog()
    } catch (err) {
      enqueueSnackbar('ERROR: Deleting photos failed', {
        variant: 'error',
      })
    }
  }

  const agreeResetPhotos = async () => {
    try {
      await resetPhotos(collection.id, collection.photos)

      dispatch(
        setCollection({
          ...collection,
          photos: collection.photos.map(photo => ({
            ...photo,
            selected: false,
            comment: '',
          })),
        }),
      )
      resetDialog()
    } catch (err) {
      enqueueSnackbar('ERROR: Resetting photos failed', {
        variant: 'error',
      })
    }
  }

  const confirmDeletion = () => {
    setConfirmationDialogOpen(true)
    setConfirmationDialogTitle('Do you really want to delete these photos?')
    setConfirmationDialogContentText('WARNING: Delete action cannot be reverted!')
    setConfirmationDialogAgree(() => agreeDelete)
  }

  const confirmResetPhotos = () => {
    setConfirmationDialogOpen(true)
    setConfirmationDialogTitle('Do you really want to reset all selections and comments?')
    setConfirmationDialogContentText('WARNING: Reset action cannot be reverted!')
    setConfirmationDialogAgree(() => agreeResetPhotos)
  }

  return (
    <Toolbar>
      {selected.length > 0 ? (
        <div className={styles.toolbarSelected}>
          <Typography color="inherit" component="div">
            {selected.length} to be deleted
          </Typography>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={confirmDeletion}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div className={styles.toolbarSelected}>
          {collection.status === 'editing' ? (
            <div className="horizontalButtons">
              <Button
                onClick={() => {
                  setAddPhotosDialogOpen(true)
                }}
                variant="outlined"
              >
                Add photos
              </Button>
              <Button onClick={confirmResetPhotos} variant="outlined">
                Reset selections and comments
              </Button>
            </div>
          ) : null}
        </div>
      )}
      <FilterButtons />
    </Toolbar>
  )
}

export default PhotoTableToolbar
