import React, { MouseEvent, useEffect, useState } from 'react'
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

import { Collection, Photo, UiState } from '../../../types'
import { getCollections, deleteCollection } from '../../../firebase'
import styles from './styles.module.scss'

import ConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialog'
import StatusIcon from '../../StatusIcon/StatusIcon'
import { RootState } from '../../../store'
import { setLoaderProgress, setUiState } from '../../../reducers/uiStateSlice'
import { deleteCollectionState, setCollectionsList } from '../../../reducers/collectionsListSlice'
import { setCollection } from '../../../reducers/singleCollectionSlice'

const CollectionList: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [requestDeleteId, setRequestDeleteId] = useState('')
  const [requestDeleteName, setRequestDeleteName] = useState('')

  const history = useHistory()

  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const collectionsList = useSelector((state: RootState) => state.collectionsList.collections)

  useEffect(() => {
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
  }, [dispatch, enqueueSnackbar])

  if (!collectionsList) return null

  const selectedPhotos = (photos: Photo[]) => {
    return photos.filter(photo => photo.selected).length
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

  const handleRowClick = (collection: Collection) => {
    dispatch(setCollection(collection))
    history.push(`edit/${collection.id}`)
  }

  const handleDeleteClick = (collectionId: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    setDialogOpen(true)
    setRequestDeleteId(collectionId)
    const collectionToDelete = collectionsList.find(collection => collection.id === collectionId)
    if (collectionToDelete) {
      setRequestDeleteName(collectionToDelete.title)
    }
  }

  return (
    <div className={styles.tableContainer}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="10%" />
              <TableCell>Title</TableCell>
              <TableCell width="15%">Status</TableCell>
              <TableCell width="15%">Selected Photos</TableCell>
              <TableCell width="15%">Created at</TableCell>
              <TableCell width="5%" />
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionsList?.map(collection => {
              return (
                <TableRow key={collection.id} hover onClick={() => handleRowClick(collection)}>
                  <TableCell>
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
                  <TableCell>{collection.title}</TableCell>
                  <TableCell>
                    <StatusIcon status={collection.status} />
                  </TableCell>
                  <TableCell>
                    {`${selectedPhotos(collection.photos)} / ${collection.photos.length}`}
                  </TableCell>
                  <TableCell>
                    {new Date(collection.dateCreated * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton
                        color="inherit"
                        aria-label="delete"
                        onClick={handleDeleteClick(collection.id)}
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
