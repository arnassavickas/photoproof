import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Collection, Photo } from '../../../types';
import { getCollections, deleteCollection } from '../../../firebase';
import styles from './styles.module.scss';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import ConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialog';
import StatusIcon from '../../StatusIcon/StatusIcon';

const CollectionList: React.FC = () => {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestDeleteId, setRequestDeleteId] = useState('');
  const [requestDeleteName, setRequestDeleteName] = useState('');
  const history = useHistory();

  useEffect(() => {
    getCollections().then((data) => setCollections(data));
  }, []);

  const selectedPhotos = (photos: Photo[]) => {
    return photos.filter((photo) => photo.selected).length;
  };

  const requestToDelete = (collectionId: string) => {
    setDialogOpen(true);
    setRequestDeleteId(collectionId);
    if (collections) {
      const collectionToDelete = collections.find(
        (collection) => collection.id === collectionId
      );
      if (collectionToDelete) {
        setRequestDeleteName(collectionToDelete.title);
      }
    }
  };

  const handleAgree = async () => {
    await deleteCollection(requestDeleteId, setDeleteProgress);
    setDialogOpen(false);
    setDeleteProgress(0);
    if (collections) {
      const filterRemovedCollection = collections.filter(
        (collection) => collection.id !== requestDeleteId
      );
      if (filterRemovedCollection) {
        setCollections(filterRemovedCollection);
      }
    }
  };

  const handleRowClick = (collectionId: string) => {
    history.push(`edit/${collectionId}`);
  };

  if (collections === null) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />.
      </Backdrop>
    );
  } else {
    return (
      <div className={styles.tableContainer}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width='10%'>first image</TableCell>
                <TableCell width='30%'>name</TableCell>
                <TableCell width='20%'>status</TableCell>
                <TableCell>selected photos</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections.map((collection) => {
                return (
                  <TableRow key={collection.id} hover={true}>
                    <TableCell onClick={() => handleRowClick(collection.id)}>
                      {collection.photos[0] ? (
                        <picture>
                          <source
                            srcSet={collection.photos[0].thumbnailWebp}
                            type='image/webp'
                          />
                          <img
                            src={collection.photos[0].thumbnail}
                            alt='first collection img'
                            className={styles.thumbnail}
                          />
                        </picture>
                      ) : null}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(collection.id)}>
                      {collection.title}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(collection.id)}>
                      <StatusIcon status={collection.status} />
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(collection.id)}>
                      {selectedPhotos(collection.photos)}
                      {' / '}
                      {collection.photos.length}
                    </TableCell>
                    <TableCell align='right'>
                      <Tooltip title='Delete'>
                        <IconButton
                          color='inherit'
                          aria-label='delete'
                          onClick={() => requestToDelete(collection.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <ConfirmationDialog
          dialogOpen={dialogOpen}
          progress={deleteProgress}
          onClickCancel={() => setDialogOpen(false)}
          onClickAgree={handleAgree}
          dialogTitle={`Do you really want to delete collection '${requestDeleteName}'?`}
          dialogContentText={'Delete action cannot be reverted!'}
        />
      </div>
    );
  }
};

export default CollectionList;
