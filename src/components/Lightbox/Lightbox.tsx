import React, { useEffect } from 'react';
import { LightboxProps } from '../../types';
import styles from './styles.module.scss';
// @ts-ignore
import { isWebpSupported } from 'react-image-webp/dist/utils';
import Lightbox from 'react-image-lightbox';
import { Typography } from '@material-ui/core';

const LightboxComponent: React.FC<LightboxProps> = ({
  filteredPhotos,
  lightboxOpen,
  setLightboxOpen,
  lightboxIndex,
  setLightboxIndex,
  toolbarButtons,
}) => {
  useEffect(() => {
    if (window.innerHeight < document.body.clientHeight) {
      if (lightboxOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'overlay';
      }
    }
  }, [lightboxOpen]);

  const root = document.querySelector('#root');

  const blurRoot = () => {
    setTimeout(() => {
      if (root instanceof HTMLElement) {
        root.style.filter = 'blur(10px)';
      }
    }, 100);
  };

  const unblurRoot = () => {
    if (root instanceof HTMLElement) {
      root.style.filter = '';
    }
  };

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
        onCloseRequest={() => {
          unblurRoot();
          setLightboxOpen(false);
        }}
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
        onImageLoad={blurRoot}
        animationDisabled={true}
      />
    );
  }

  return <></>;
};

export default LightboxComponent;
