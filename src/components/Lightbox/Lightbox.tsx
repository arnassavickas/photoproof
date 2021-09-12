import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

// @ts-ignore always returns boolean
// eslint-disable-next-line import/no-extraneous-dependencies
import { isWebpSupported } from 'react-image-webp/dist/utils'
import Lightbox from 'react-image-lightbox'
import { Typography } from '@material-ui/core'

import styles from './styles.module.scss'
import { LightboxProps } from '../../types'
import { getFilteredPhotos } from '../../reducers/collectionsSelectors'

const LightboxComponent: React.FC<LightboxProps> = ({
  lightboxOpen,
  setLightboxOpen,
  lightboxIndex,
  setLightboxIndex,
  toolbarButtons,
}) => {
  const filteredPhotos = useSelector(getFilteredPhotos())

  useEffect(() => {
    if (window.innerHeight < document.body.clientHeight) {
      if (lightboxOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'overlay'
      }
    }
  }, [lightboxOpen])

  const root = document.querySelector('#root')

  useEffect(() => {
    if (lightboxOpen) {
      setTimeout(() => {
        if (root instanceof HTMLElement) {
          root.style.filter = 'blur(10px)'
        }
      }, 100)
    }

    return () => {
      if (root instanceof HTMLElement) {
        root.style.filter = ''
      }
    }
  }, [lightboxOpen, root])

  if (!lightboxOpen) return null

  return (
    <Lightbox
      mainSrc={
        isWebpSupported
          ? filteredPhotos[lightboxIndex]?.cloudUrlWebp
          : filteredPhotos[lightboxIndex]?.cloudUrl
      }
      nextSrc={
        isWebpSupported
          ? filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length]?.cloudUrlWebp
          : filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length]?.cloudUrl
      }
      prevSrc={
        isWebpSupported
          ? filteredPhotos[(lightboxIndex + filteredPhotos.length - 1) % filteredPhotos.length]
              ?.cloudUrlWebp
          : filteredPhotos[(lightboxIndex + filteredPhotos.length - 1) % filteredPhotos.length]
              ?.cloudUrl
      }
      onCloseRequest={() => setLightboxOpen(false)}
      onMovePrevRequest={() =>
        setLightboxIndex((lightboxIndex + filteredPhotos.length - 1) % filteredPhotos.length)
      }
      onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
      toolbarButtons={toolbarButtons}
      enableZoom={false}
      imageTitle={
        <Typography classes={{ root: styles.photoIndex }}>
          {filteredPhotos[lightboxIndex]?.index}
        </Typography>
      }
      animationDisabled
    />
  )
}

export default LightboxComponent
