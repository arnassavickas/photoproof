import React from 'react';
import styles from './styles.module.scss';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface CommentDialogProps {
  commentOpen: boolean;
  setCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  commentTextarea: string;
  setCommentTextarea?: React.Dispatch<React.SetStateAction<string>>;
  actionButtons?: React.ReactNode[];
  disabled?: boolean;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  commentOpen,
  setCommentOpen,
  commentTextarea,
  setCommentTextarea,
  actionButtons,
  disabled,
}) => {
  const handleCommentTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (setCommentTextarea) setCommentTextarea(e.target.value);
  };

  return (
    <Dialog open={commentOpen} onClose={() => setCommentOpen(false)}>
      <IconButton
        onClick={() => setCommentOpen(false)}
        className={styles.exitBtn}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle id='alert-dialog-title'>Comment</DialogTitle>
      <DialogContent>
        <TextField
          classes={disabled ? { root: styles.disabledTextarea } : undefined}
          multiline
          rows={4}
          variant='outlined'
          value={commentTextarea}
          onChange={handleCommentTextarea}
          disabled={disabled}
        />
      </DialogContent>
      <DialogActions>{actionButtons}</DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
