import React, { useEffect } from 'react';
import { LightboxProps } from '../../types';
import styles from './styles.module.scss';
// @ts-ignore
import { isWebpSupported } from 'react-image-webp/dist/utils';
import Lightbox from 'react-image-lightbox';
import { Typography } from '@material-ui/core';

//TODO toolbar obstructs photo
//TODO arrow buttons obstruct photo

const LightboxComponent: React.FC<LightboxProps> = ({
  filteredPhotos,
  lightboxOpen,
  setLightboxOpen,
  lightboxIndex,
  setLightboxIndex,
  toolbarButtons,
}) => {
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style['paddingRight'] = '0.7em';
    } else if (!lightboxOpen) {
      document.body.style.overflow = 'unset';
      document.body.style['paddingRight'] = '0';
    }
  }, [lightboxOpen]);

  if (lightboxOpen) {
    return (
      <Lightbox
        mainSrc={
          isWebpSupported
            ? filteredPhotos[lightboxIndex].cloudUrlWebp
            : filteredPhotos[lightboxIndex].cloudUrl
        }
        nextSrc={
          isWebpSupported
            ? filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length]
                .cloudUrlWebp
            : filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length]
                .cloudUrl
        }
        prevSrc={
          isWebpSupported
            ? filteredPhotos[
                (lightboxIndex + filteredPhotos.length - 1) %
                  filteredPhotos.length
              ].cloudUrlWebp
            : filteredPhotos[
                (lightboxIndex + filteredPhotos.length - 1) %
                  filteredPhotos.length
              ].cloudUrl
        }
        onCloseRequest={() => setLightboxOpen(false)}
        onMovePrevRequest={() =>
          setLightboxIndex(
            (lightboxIndex + filteredPhotos.length - 1) % filteredPhotos.length
          )
        }
        onMoveNextRequest={() =>
          setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
        }
        toolbarButtons={toolbarButtons}
        enableZoom={false}
        imageTitle={
          <Typography classes={{ root: styles.photoIndex }}>
            {filteredPhotos[lightboxIndex].index}
          </Typography>
        }
      />
    );
  }

  return <></>;
};

export default LightboxComponent;
