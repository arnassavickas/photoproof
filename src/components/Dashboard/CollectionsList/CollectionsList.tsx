import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import { Photo, UiState } from '../../../types'
import { getCollections, deleteCollection } from '../../../firebase'
import styles from './styles.module.scss'

import ConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialog'
import StatusIcon from '../../StatusIcon/StatusIcon'
import { RootState } from '../../../store'
import { setLoaderProgress, setUiState } from '../../../reducers/uiStateSlice'
import { deleteCollectionState, setCollectionsList } from '../../../reducers/collectionsListSlice'

const CollectionList: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [requestDeleteId, setRequestDeleteId] = useState('')
  const [requestDeleteName, setRequestDeleteName] = useState('')

  const history = useHistory()

  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const collectionsList = useSelector((state: RootState) => state.collectionsList.collectionsList)
  const collection = useSelector((state: RootState) => state.singleCollection.collection)

  useEffect(() => {
    if (collectionsList.length === 0) {
      dispatch(setUiState(UiState.Pending))

      getCollections()
        .then(collections => {
          dispatch(setCollectionsList(collections))
          dispatch(setUiState(UiState.Success))
        })
        .catch(() => {
          enqueueSnackbar('ERROR: Getting collections failed. Please refresh the page', {
            variant: 'error',
            persist: true,
          })
        })
    }
  }, [collectionsList.length, dispatch, enqueueSnackbar])

  if (!collectionsList) return null

  const selectedPhotos = (photos: Photo[]) => {
    return photos.filter(photo => photo.selected).length
  }

  const requestToDelete = (collectionId: string) => {
    setDialogOpen(true)
    setRequestDeleteId(collectionId)
    if (collectionsList) {
      const collectionToDelete = collectionsList.find(collection => collection.id === collectionId)
      if (collectionToDelete) {
        setRequestDeleteName(collectionToDelete.title)
      }
    }
  }

  const handleLoaderProgressChange = (progress: number) => {
    dispatch(setLoaderProgress(progress))
  }

  const handleDelete = async () => {
    try {
      await deleteCollection(requestDeleteId, handleLoaderProgressChange)
      setDialogOpen(false)
      dispatch(setLoaderProgress(0))
      dispatch(deleteCollectionState(requestDeleteId))
    } catch (err) {
      enqueueSnackbar('ERROR: Photo deletion failed', {
        variant: 'error',
      })
    }
  }

  const handleRowClick = (collectionId: string) => {
    if (collection?.id !== collectionId) {
      dispatch(setUiState(UiState.Pending))
    }
    history.push(`edit/${collectionId}`)
  }

  return (
    <div className={styles.tableContainer}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="10%">first image</TableCell>
              <TableCell width="30%">name</TableCell>
              <TableCell width="20%">status</TableCell>
              <TableCell>selected photos</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionsList?.map(collection => {
              return (
                <TableRow key={collection.id} hover>
                  <TableCell onClick={() => handleRowClick(collection.id)}>
                    {collection.photos[0] ? (
                      <picture>
                        <source srcSet={collection.photos[0].thumbnailWebp} type="image/webp" />
                        <img
                          src={collection.photos[0].thumbnail}
                          alt="first collection img"
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
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton
                        color="inherit"
                        aria-label="delete"
                        onClick={() => requestToDelete(collection.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationDialog
        dialogOpen={dialogOpen}
        onClickCancel={() => setDialogOpen(false)}
        onClickAgree={handleDelete}
        dialogTitle={`Do you really want to delete collection '${requestDeleteName}'?`}
        dialogContentText="Delete action cannot be reverted!"
      />
    </div>
  )
}

export default CollectionList
