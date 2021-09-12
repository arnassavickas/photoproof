import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import styles from './styles.module.scss'
import { setPhotoFilter } from '../../reducers/collectionsSlice'
import { getCurrentCollection } from '../../reducers/collectionsSelectors'

const FilterButtons = () => {
  const [filter, setFilter] = useState('all')

  const dispatch = useDispatch()
  const collection = useSelector(getCurrentCollection())

  useEffect(() => {
    return () => {
      dispatch(setPhotoFilter('all'))
    }
  }, [dispatch])

  if (!collection) return null

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
  }

  const handleUnselectedClick = () => {
    dispatch(setPhotoFilter('unselected'))
    setFilter('unselected')
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
