import React from 'react'
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

import styles from './styles.module.scss'
import { PhotoTableProps } from '../../../types'

import ImageLoader from '../../ImageLoader/ImageLoader'
import DraggableComponent from './DraggableComponent/DraggableComponent'
import DroppableComponent from './DroppableComponent/DroppableComponent'

const PhotoTable: React.FC<PhotoTableProps> = ({
  collection,
  setCollection,
  filteredPhotos,
  selected,
  setSelected,
  setPhotoIndex,
  setLightboxOpen,
}) => {
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

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
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
    // dropped outside the list
    if (!result.destination) {
      return
    }

    console.log(`dragEnd ${result.source.index} to  ${result.destination.index}`)
    // const items = reorder(
    //   this.state.items,
    //   result.source.index,
    //   result.destination.index
    // );

    // this.setState({
    //   items,
    // });
  }

  const reorder = (
    list: Iterable<unknown> | ArrayLike<unknown>,
    startIndex: number,
    endIndex: number,
  ) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
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
              no.
            </TableCell>
            <TableCell width="10%">thumbnail</TableCell>
            <TableCell width="30%">filename</TableCell>
            <TableCell padding="checkbox" />
            <TableCell>comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component={DroppableComponent(onDragEnd)}>
          {filteredPhotos.map((photo, index) => (
            <TableRow
              key={photo.id}
              selected={isSelected(photo.id)}
              component={DraggableComponent(photo.id, index)}
            >
              {collection.status === 'editing' ? (
                <TableCell
                  data-testid="checkbox"
                  padding="checkbox"
                  onClick={event => handleClick(event, photo.id)}
                >
                  <Checkbox checked={isSelected(photo.id)} />
                </TableCell>
              ) : null}
              <TableCell>{photo.index}.</TableCell>
              <TableCell padding="none">
                <ImageLoader
                  setCollection={setCollection}
                  collectionId={collection.id}
                  photo={photo}
                  width={150}
                  height={100}
                >
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
