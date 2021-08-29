import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useSelector } from 'react-redux'

import styles from './styles.module.scss'
import { ConfirmationDialogProps } from '../../types'
import { RootState } from '../../store'

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogOpen,
  onClickCancel,
  onClickAgree,
  dialogTitle,
  dialogContentText,
}) => {
  const progress = useSelector((state: RootState) => state.uiState.loaderProgress)

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <IconButton onClick={onClickCancel} className={styles.exitBtn}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{dialogContentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={!!progress} onClick={onClickCancel} color="primary" autoFocus>
          Cancel
        </Button>
        <Button disabled={!!progress} onClick={onClickAgree} color="secondary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
