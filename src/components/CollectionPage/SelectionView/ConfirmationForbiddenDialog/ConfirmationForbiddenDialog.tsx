import React from 'react'
import { useSelector } from 'react-redux'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  DialogContentText,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import styles from './styles.module.scss'
import { ConfirmationForbiddenProps } from '../../../../types'
import { RootState } from '../../../../store'

const ConfirmationForbiddenDialog: React.FC<ConfirmationForbiddenProps> = ({
  selectedPhotos,
  confirmForbidDialogOpen,
  setConfirmForbidDialogOpen,
}) => {
  const collection = useSelector((state: RootState) => state.collection.collection)

  if (!collection) return null

  const requirementsText = () => {
    if (collection.minSelect.required && collection.maxSelect.required) {
      return (
        <span>
          you must select{' '}
          <strong>
            from {collection.minSelect.goal} to {collection.maxSelect.goal}
          </strong>{' '}
          photos.
        </span>
      )
    }
    if (collection.minSelect.required && !collection.maxSelect.required) {
      return (
        <span>
          you must select <strong>at least {collection.minSelect.goal}</strong> photos.
        </span>
      )
    }
    if (!collection.minSelect.required && collection.maxSelect.required) {
      return (
        <span>
          you must select <strong>a maximum of {collection.maxSelect.goal}</strong> photos.
        </span>
      )
    }

    return null
  }

  return (
    <Dialog open={confirmForbidDialogOpen} onClose={() => setConfirmForbidDialogOpen(false)}>
      <DialogTitle id="alert-dialog-title">Please adjust your selections!</DialogTitle>
      <IconButton onClick={() => setConfirmForbidDialogOpen(false)} className={styles.exitBtn}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogContentText>
          You have selected <strong>{selectedPhotos}</strong> photos, but {requirementsText()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmForbidDialogOpen(false)} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationForbiddenDialog
