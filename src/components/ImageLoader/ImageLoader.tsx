import React, { useEffect, useState } from 'react'
import { Skeleton } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close'

import { Photo, Collection } from '../../types'
import { setResizeReady } from '../../firebase'

interface ImageLoaderProps {
  collectionId: string
  setCollection: React.Dispatch<React.SetStateAction<Collection | null>>
  photo: Photo
  children: React.ReactNode
  width: number
  height: number
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  collectionId,
  setCollection,
  photo,
  children,
  width,
  height,
}) => {
  const [imageReady, setImageReady] = useState(photo.resizeReady)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (photo.resizeReady) {
      return
    }
    fetch(photo.cloudUrlWebp, {}).then(res => {
      if (res.ok) {
        setImageReady(true)
      } else {
        let trie = 1
        const intervalId = setInterval(() => {
          fetch(photo.cloudUrlWebp, {}).then(res => {
            if (res.ok) {
              clearInterval(intervalId)
              setImageReady(true)
              setResizeReady(collectionId, photo.id)
              setCollection(collection => {
                if (!collection) {
                  return null
                }
                return {
                  ...collection,
                  photos: collection?.photos.map(collectionPhoto =>
                    collectionPhoto.id === photo.id
                      ? { ...photo, resizeReady: true }
                      : collectionPhoto,
                  ),
                }
              })
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
