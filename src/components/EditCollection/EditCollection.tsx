import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useParams, Link } from 'react-router-dom';
import { Collection, Photo } from '../../types';
import {
  getSingleCollection,
  deletePhotos,
  addMorePhotos,
  resetPhotos,
} from '../../firebase';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Backdrop,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Box,
  Paper,
} from '@material-ui/core';

import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import MessageIcon from '@material-ui/icons/Message';
import CloseIcon from '@material-ui/icons/Close';

import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { DropzoneArea } from 'material-ui-dropzone';
import { useForm, Controller } from 'react-hook-form';

import CollectionDetails from './CollectionDetails/CollectionDetails';
import ImageLoader from '../ImageLoader/ImageLoader';
import Lightbox from '../Lightbox/Lightbox';

const EditCollection: React.FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[] | null>(null);
  const [filter, setFilter] = useState('all');
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

  const {
    handleSubmit: handleSubmitFiles,
    //TODO add error if no files added to upload
    errors: errorsFiles,
    control: controlFiles,
  } = useForm<any>({
    defaultValues: { files: [] },
  });

  useEffect(() => {
    getSingleCollection(collectionId).then((collection) => {
      setCollection(collection);
      setFilteredPhotos(collection.photos);
    });
  }, [collectionId]);

  const changeFilter = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFilter(e.target.value as string);
  };

  useEffect(() => {
    if (collection) {
      switch (filter) {
        case 'all':
          return setFilteredPhotos(collection.photos);
        case 'selected':
          const selectedPhotos = collection.photos.filter(
            (photo) => photo.selected
          );
          return setFilteredPhotos(selectedPhotos);
        case 'unselected':
          const unselectedPhotos = collection.photos.filter(
            (photo) => !photo.selected
          );
          return setFilteredPhotos(unselectedPhotos);
      }
    }
  }, [filter, collection]);

  const openLightbox = (index: number) => (event: any) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && filteredPhotos) {
      const newSelecteds = filteredPhotos.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const agreeDelete = async () => {
    await deletePhotos(collectionId, selected, setProgress);
    if (collection) {
      const removeDeleted = collection.photos
        .filter((photo) => {
          for (let id of selected) {
            if (photo.id === id) {
              return false;
            }
          }
          return true;
        })
        .map((photo, index) => {
          return { ...photo, index: index + 1 };
        });
      setCollection({
        ...collection,
        photos: removeDeleted,
      });
    }
    setSelected([]);
    resetDialog();
  };

  const onConfirmUpload = async (data: { files: FileList }) => {
    console.log(data);
    await addMorePhotos(collectionId, data.files, setProgress);
    setAddPhotosDialogOpen(false);
    setProgress(0);
    getSingleCollection(collectionId).then((collection) => {
      setCollection(collection);
    });
  };

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

  const agreeResetPhotos = async () => {
    if (collection) {
      try {
        await resetPhotos(collectionId, collection.photos);
        setCollection({
          ...collection,
          photos: collection.photos.map((photo) => ({
            ...photo,
            selected: false,
            comment: '',
          })),
        });
        resetDialog();
      } catch (err) {
        //
      }
    }
  };

  const confirmDeletion = () => {
    setConfirmationDialogOpen(true);
    setConfirmationDialogTitle('Do you really want to delete these photos?');
    setConfirmationDialogContentText(
      'WARNING: Delete action cannot be reverted!'
    );
    setConfirmationDialogAgree(() => agreeDelete);
  };

  const confirmResetPhotos = () => {
    setConfirmationDialogOpen(true);
    setConfirmationDialogTitle(
      'Do you really want to reset all selections and comments?'
    );
    setConfirmationDialogContentText(
      'WARNING: Reset action cannot be reverted!'
    );
    setConfirmationDialogAgree(() => agreeResetPhotos);
  };

  const resetDialog = () => {
    setConfirmationDialogOpen(false);
    setConfirmationDialogTitle('');
    setConfirmationDialogContentText('');
    setConfirmationDialogAgree(() => {});
    setProgress(0);
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
      <Toolbar>
        {selected.length > 0 ? (
          <div className={styles.toolbarSelected}>
            <Typography color='inherit' component='div'>
              {selected.length} to be deleted
            </Typography>
            <Tooltip title='Delete'>
              <IconButton aria-label='delete' onClick={confirmDeletion}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className={styles.toolbarSelected}>
            {collection.status === 'editing' ? (
              <div>
                <Button
                  onClick={() => {
                    setAddPhotosDialogOpen(true);
                  }}
                  variant='outlined'
                >
                  Add photos
                </Button>
                <Button onClick={confirmResetPhotos} variant='outlined'>
                  Reset selections and comments
                </Button>
              </div>
            ) : null}
          </div>
        )}
        <FormControl className={styles.toolbarFilter}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={changeFilter}>
            <MenuItem value={'all'}>All</MenuItem>
            <MenuItem value={'selected'}>Selected</MenuItem>
            <MenuItem value={'unselected'}>Unselected</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              {collection.status === 'editing' ? (
                <TableCell padding='checkbox'>
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredPhotos.length
                    }
                    checked={
                      filteredPhotos.length > 0 &&
                      selected.length === filteredPhotos.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              ) : null}
              <TableCell width='5%'>no.</TableCell>
              <TableCell width='10%'>thumbnail</TableCell>
              <TableCell width='30%'>filename</TableCell>
              <TableCell padding='checkbox'></TableCell>
              <TableCell>comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPhotos.map((photo, index) => (
              <TableRow
                key={photo.id}
                selected={isSelected(photo.id)}
                hover={true}
              >
                {collection.status === 'editing' ? (
                  <TableCell
                    padding='checkbox'
                    onClick={(event) => handleClick(event, photo.id)}
                  >
                    <Checkbox checked={isSelected(photo.id)} />
                  </TableCell>
                ) : null}
                <TableCell>{photo.index}.</TableCell>
                <TableCell padding='none'>
                  <ImageLoader photo={photo} width={150} height={100}>
                    <picture>
                      <source srcSet={photo.thumbnailWebp} type='image/webp' />
                      <img
                        src={photo.thumbnail}
                        alt={collection.title}
                        className={styles.thumbnail}
                        onClick={openLightbox(index)}
                      />
                    </picture>
                  </ImageLoader>
                </TableCell>
                <TableCell>{photo.filename}</TableCell>
                <TableCell padding='checkbox'>
                  {photo.selected ? <StarBorderIcon /> : null}
                </TableCell>
                <TableCell>{photo.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      <Dialog open={addPhotosDialogOpen}>
        <form onSubmit={handleSubmitFiles(onConfirmUpload)}>
          <DialogTitle id='alert-dialog-title'>Add photos</DialogTitle>
          <DialogContent>
            {progress ? (
              <Box p={'3px'}>
                <LinearProgress variant='determinate' value={progress} />
              </Box>
            ) : (
              <Box p={'5px'}></Box>
            )}
            <Controller
              name='files'
              control={controlFiles}
              render={({ onChange }) => (
                <DropzoneArea
                  acceptedFiles={['image/jpeg']}
                  dropzoneText={'Drop images or click to upload here'}
                  onChange={(files) => {
                    return onChange([...files]);
                  }}
                  filesLimit={999}
                  previewGridClasses={{
                    container: styles.previewContainer,
                    item: `${styles.previewItem} itemReference`,
                    image: styles.previewImage,
                  }}
                  previewGridProps={{
                    container: {
                      spacing: 1,
                    },
                    item: { sm: 2, lg: 2, md: 2 },
                  }}
                  showAlerts={false}
                  showPreviewsInDropzone={false}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                  dropzoneClass={styles.dropzone}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!!progress}
              onClick={() => setAddPhotosDialogOpen(false)}
              color='secondary'
            >
              Cancel
            </Button>
            <Button disabled={!!progress} color='primary' type='submit'>
              Yes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={commentOpen} onClose={() => setCommentOpen(false)}>
        <IconButton
          onClick={() => setCommentOpen(false)}
          className={styles.exitBtn}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle id='alert-dialog-title'>Comment</DialogTitle>
        <DialogContent>
          <Paper className={styles.commentTextContainer} elevation={3}>
            <Typography>{commentTextarea}</Typography>
          </Paper>
          <DialogActions></DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCollection;
