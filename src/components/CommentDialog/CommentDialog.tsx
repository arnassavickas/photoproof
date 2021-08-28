import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import styles from './styles.module.scss'
import { CommentDialogProps } from '../../types'

const CommentDialog: React.FC<CommentDialogProps> = ({
  commentOpen,
  setCommentOpen,
  commentTextarea,
  setCommentTextarea,
  actionButtons,
  disabled,
}) => {
  const handleCommentTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    if (setCommentTextarea) setCommentTextarea(event.target.value)
  }

  return (
    <Dialog open={commentOpen} onClose={() => setCommentOpen(false)}>
      <IconButton onClick={() => setCommentOpen(false)} className={styles.exitBtn}>
        <CloseIcon />
      </IconButton>
      <DialogTitle id="alert-dialog-title">Comment</DialogTitle>
      <DialogContent>
        <TextField
          classes={disabled ? { root: styles.disabledTextarea } : undefined}
          multiline
          rows={4}
          variant="outlined"
          value={commentTextarea}
          onChange={handleCommentTextarea}
          disabled={disabled}
        />
      </DialogContent>
      <DialogActions>{actionButtons}</DialogActions>
    </Dialog>
  )
}

export default CommentDialog
