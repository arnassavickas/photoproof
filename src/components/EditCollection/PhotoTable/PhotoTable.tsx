import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import { useSnackbar } from 'notistack'

import styles from './styles.module.scss'
import { PhotoTableProps } from '../../../types'

import ImageLoader from '../../ImageLoader/ImageLoader'
import DraggableComponent from './DraggableComponent/DraggableComponent'
import DroppableComponent from './DroppableComponent/DroppableComponent'
import { RootState } from '../../../store'
import { changeOrder } from '../../../reducers/singleCollectionSlice'

const PhotoTable: React.FC<PhotoTableProps> = ({
  selected,
  setSelected,
  setPhotoIndex,
  setLightboxOpen,
}) => {
  const dispatch = useDispatch()
  const collection = useSelector((state: RootState) => state.singleCollection.collection)
  const filteredPhotos = useSelector((state: RootState) => state.singleCollection.filteredPhotos)
  const filter = useSelector((state: RootState) => state.singleCollection.filter)

  const { enqueueSnackbar } = useSnackbar()

  if (!collection) return null

  const openLightbox = (index: number) => () => {
    setPhotoIndex(index)
    setLightboxOpen(true)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && filteredPhotos) {
      const newSelecteds = filteredPhotos.map(photo => photo.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const onDragEnd = (result: { destination: { index: number }; source: { index: number } }) => {
    if (!result.destination) {
      return
    }

    if (filter !== 'all') {
      enqueueSnackbar('Reordering is only allowed when filter is "ALL"', {
        variant: 'warning',
      })
    } else {
      dispatch(
        changeOrder({
          source: result.source.index,
          destination: result.destination.index,
        }),
      )
    }
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {collection.status === 'editing' ? (
              <TableCell padding="checkbox" size="medium">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredPhotos.length}
                  checked={filteredPhotos.length > 0 && selected.length === filteredPhotos.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
            ) : null}
            <TableCell width="5%" size="medium">
              No.
            </TableCell>
            <TableCell width="10%" />
            <TableCell width="30%">Filename</TableCell>
            <TableCell padding="checkbox" />
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component={DroppableComponent(onDragEnd, collection.status !== 'editing')}>
          {filteredPhotos.map((photo, index) => (
            <TableRow
              key={photo.id}
              selected={isSelected(photo.id)}
              component={DraggableComponent(photo.id, index, collection.status !== 'editing')}
            >
              {collection.status === 'editing' ? (
                <TableCell
                  data-testid="checkbox"
                  padding="checkbox"
                  onClick={() => handleClick(photo.id)}
                >
                  <Checkbox checked={isSelected(photo.id)} />
                </TableCell>
              ) : null}
              <TableCell>{photo.index}.</TableCell>
              <TableCell padding="none">
                <ImageLoader collectionId={collection.id} photo={photo} width={150} height={100}>
                  <picture>
                    <source srcSet={photo.thumbnailWebp} type="image/webp" />
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
              <TableCell padding="checkbox">
                {photo.selected ? <FavoriteBorder data-testid="selected" /> : null}
              </TableCell>
              <TableCell data-testid="comment">{photo.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PhotoTable
