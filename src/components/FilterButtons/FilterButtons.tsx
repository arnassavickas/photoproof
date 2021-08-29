import React, { useState } from 'react'
import { Button, ButtonGroup } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import styles from './styles.module.scss'
import { FilterButtonsProps } from '../../types'
import { setPhotoFilter } from '../../reducers/singleCollectionSlice'
import { RootState } from '../../store'

const FilterButtons: React.FC<FilterButtonsProps> = ({
  setLightboxOpen,
  photoIndex,
  setPhotoIndex,
}) => {
  const [filter, setFilter] = useState('all')

  const dispatch = useDispatch()
  const filteredPhotos = useSelector((state: RootState) => state.singleCollection.filteredPhotos)
  const collection = useSelector((state: RootState) => state.singleCollection.collection)

  if (!collection) return null

  const modifyLightbox = () => {
    if (setLightboxOpen && photoIndex && setPhotoIndex) {
      if (filteredPhotos.length === 0) {
        setLightboxOpen(false)
      } else if (filteredPhotos.length <= photoIndex) {
        setPhotoIndex(filteredPhotos.length - 1)
      }
    }
  }

  const photosCount = (() => {
    const all = collection.photos.length
    const selected = collection.photos.filter(photo => photo.selected).length
    const notSelected = all - selected
    return { all, selected, notSelected }
  })()

  const handleAllClick = () => {
    dispatch(setPhotoFilter('all'))
    setFilter('all')
  }

  const handleSelectedClick = () => {
    dispatch(setPhotoFilter('selected'))
    setFilter('selected')
    modifyLightbox()
  }

  const handleUnselectedClick = () => {
    dispatch(setPhotoFilter('unselected'))
    setFilter('unselected')
    modifyLightbox()
  }

  return (
    <ButtonGroup className={styles.filterBtns} aria-label="outlined primary button group">
      <Button
        variant={filter === 'selected' ? 'contained' : undefined}
        onClick={handleSelectedClick}
      >
        Selected &nbsp;&nbsp;{photosCount.selected}
      </Button>
      <Button variant={filter === 'all' ? 'contained' : undefined} onClick={handleAllClick}>
        All &nbsp;&nbsp;{photosCount.all}
      </Button>
      <Button
        variant={filter === 'unselected' ? 'contained' : undefined}
        onClick={handleUnselectedClick}
      >
        Not Selected &nbsp;&nbsp;{photosCount.notSelected}
      </Button>
    </ButtonGroup>
  )
}

export default FilterButtons
