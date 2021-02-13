import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useParams, Link } from 'react-router-dom';
import { Collection, Photo } from '../../types';
import { getSingleCollection } from '../../firebase';
import {
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
} from '@material-ui/core';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import MessageIcon from '@material-ui/icons/Message';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

import CollectionDetails from './CollectionDetails/CollectionDetails';
import PhotoTableToolbar from './PhotoTableToolbar/PhotoTableToolbar';
import PhotoTable from './PhotoTable/PhotoTable';
import AddPhotosDialog from './AddPhotosDialog/AddPhotosDialog';
import Lightbox from '../Lightbox/Lightbox';
import CommentDialog from '../CommentDialog/CommentDialog';

const EditCollection: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[] | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('');
  const [
    confirmationDialogContentText,
    setConfirmationDialogContentText,
  ] = useState('');
  const [confirmationDialogAgree, setConfirmationDialogAgree] = useState<
    (value: any) => void
  >(() => {});
  const [progress, setProgress] = useState(0);

  const [addPhotosDialogOpen, setAddPhotosDialogOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentTextarea, setCommentTextarea] = useState('');

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!lightboxOpen) {
      document.body.style.overflow = 'unset';
    }
  }, [lightboxOpen]);

  useEffect(() => {
    getSingleCollection(collectionId).then((collection) => {
      setCollection(collection);
      setFilteredPhotos(collection.photos);
    });
  }, [collectionId]);

  const openCommentModal = (index?: number) => {
    setCommentOpen(true);
    if (filteredPhotos) {
      if (index) {
        setPhotoIndex(index);
        setCommentTextarea(filteredPhotos[index].comment);
      } else {
        setCommentTextarea(filteredPhotos[photoIndex].comment);
      }
    }
  };

  if (collection === null || filteredPhotos === null) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />.
      </Backdrop>
    );
  }

  return (
    <div>
      <Button to='/' component={Link} variant='outlined'>
        Home
      </Button>
      <CollectionDetails
        collectionId={collectionId}
        collection={collection}
        setCollection={setCollection}
        filteredPhotos={filteredPhotos}
        setConfirmationDialogOpen={setConfirmationDialogOpen}
        setConfirmationDialogTitle={setConfirmationDialogTitle}
        setConfirmationDialogContentText={setConfirmationDialogContentText}
        setConfirmationDialogAgree={setConfirmationDialogAgree}
        setProgress={setProgress}
      />
      <PhotoTableToolbar
        collectionId={collectionId}
        collection={collection}
        setCollection={setCollection}
        filteredPhotos={filteredPhotos}
        setFilteredPhotos={setFilteredPhotos}
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
        collection={collection}
        filteredPhotos={filteredPhotos}
        selected={selected}
        setSelected={setSelected}
        setPhotoIndex={setPhotoIndex}
        setLightboxOpen={setLightboxOpen}
      />
      {lightboxOpen && filteredPhotos.length > 0 && (
        <Lightbox
          filteredPhotos={filteredPhotos}
          setLightboxOpen={setLightboxOpen}
          lightboxIndex={photoIndex}
          setLightboxIndex={setPhotoIndex}
          toolbarButtons={[
            filteredPhotos[photoIndex].comment.length > 0 ? (
              <IconButton
                className={styles.toolbarIcon}
                onClick={() => openCommentModal()}
              >
                <MessageIcon />
              </IconButton>
            ) : (
              <div className={styles.toolbarIcon}></div>
            ),
            filteredPhotos[photoIndex].selected ? (
              <IconButton className={styles.toolbarIcon} disabled>
                <StarBorderIcon />
              </IconButton>
            ) : (
              <div className={styles.toolbarIcon}></div>
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
        setCollection={setCollection}
        setProgress={setProgress}
        addPhotosDialogOpen={addPhotosDialogOpen}
        setAddPhotosDialogOpen={setAddPhotosDialogOpen}
        progress={progress}
      />
      <CommentDialog
        commentOpen={commentOpen}
        setCommentOpen={setCommentOpen}
        commentTextarea={commentTextarea}
        disabled={true}
      />
    </div>
  );
};

export default EditCollection;
