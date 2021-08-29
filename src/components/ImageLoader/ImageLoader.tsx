import React, { useEffect, useState } from 'react'
import { Skeleton } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close'
import { useDispatch, useSelector } from 'react-redux'

import { Photo } from '../../types'
import { setResizeReady } from '../../firebase'
import { setCollection } from '../../reducers/collectionsSlice'
import { getCurrentCollection } from '../../reducers/collectionsSelectors'

interface ImageLoaderProps {
  collectionId: string
  photo: Photo
  children: React.ReactNode
  width: number
  height: number
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  collectionId,
  photo,
  children,
  width,
  height,
}) => {
  const [imageReady, setImageReady] = useState(photo.resizeReady)
  const [failed, setFailed] = useState(false)

  const dispatch = useDispatch()
  const collection = useSelector(getCurrentCollection())

  useEffect(() => {
    if (photo.resizeReady || !collection) {
      return
    }
    fetch(photo.cloudUrlWebp, {}).then(res => {
      if (res.ok) {
        setImageReady(true)
        setResizeReady(collectionId, photo.id)
      } else {
        let trie = 1
        const intervalId = setInterval(() => {
          fetch(photo.cloudUrlWebp, {}).then(res => {
            if (res.ok) {
              clearInterval(intervalId)
              setImageReady(true)
              setResizeReady(collectionId, photo.id)
              dispatch(
                setCollection({
                  ...collection,
                  photos: collection.photos.map(collectionPhoto =>
                    collectionPhoto.id === photo.id
                      ? { ...photo, resizeReady: true }
                      : collectionPhoto,
                  ),
                }),
              )
            } else if (trie > 10) {
              setFailed(true)
            }
            trie += 1
          })
        }, 500)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CloseIcon />
      </div>
    )
  }

  if (!imageReady) {
    return <Skeleton variant="rect" width={width} height={height} />
  }

  return <div>{children}</div>
}

export default ImageLoader
