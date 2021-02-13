import React, { useEffect, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { Photo } from '../../types';

interface ImageLoaderProps {
  photo: Photo;
  children: React.ReactNode;
  width: number;
  height: number;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  photo,
  children,
  width,
  height,
}) => {
  const [imageReady, setImageReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(photo.cloudUrlWebp, {}).then((res) => {
      if (res.ok) {
        setImageReady(true);
      } else {
        let trie = 1;
        const intervalId = setInterval(() => {
          fetch(photo.cloudUrlWebp, {}).then((res) => {
            console.log('trie :>> ', trie);
            console.log(res);
            if (res.ok) {
              clearInterval(intervalId);
              setImageReady(true);
            } else if (trie > 10) {
              console.log('set failed');
              setFailed(true);
            }
            trie += 1;
          });
        }, 500);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    );
  }

  if (!imageReady) {
    return <Skeleton variant='rect' width={width} height={height} />;
  }

  return <div>{children}</div>;
};

export default ImageLoader;
