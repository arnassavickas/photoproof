import React, { useState, Fragment } from 'react';
import styles from './styles.module.scss';
import { Link, useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Typography,
  Slider,
  Box,
  LinearProgress,
} from '@material-ui/core';
import { changeSiteSettings } from '../../firebase';

//TODO implement interactive watermark size/angle adjustment

const Settings: React.FC = () => {
  const { register, handleSubmit, control, errors } = useForm<{
    logoFile: FileList;
    logoWidth: number;
  }>();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageWidth, setImageWidth] = useState(100);
  const history = useHistory();

  const onSubmit = async (data: { logoFile: FileList; logoWidth: number }) => {
    setUploading(true);
    console.log(data);
    await changeSiteSettings(data.logoFile, data.logoWidth, setUploadProgress);
    setUploading(false);
    history.push('/');
  };

  const displayImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const changeWidth = (value: number) => {
    setImageWidth(value);
  };

  return (
    <div>
      <Button to='/' component={Link} variant='outlined'>
        Home
      </Button>
      <Typography variant='h4'>Settings</Typography>
      <img style={{ width: imageWidth }} src={image} alt='logo' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.dropzoneError}>
          <Typography variant='body1'>
            {errors.logoFile ? (
              'Images are required'
            ) : (
              <Fragment>&#8203;</Fragment>
            )}
          </Typography>
        </div>
        <input
          name='logoFile'
          ref={register}
          type='file'
          className={styles.customFileInput}
          onChange={displayImg}
        />
        <Controller
          name='logoWidth'
          control={control}
          defaultValue={imageWidth}
          render={({ onChange }) => (
            <Slider
              ref={register}
              defaultValue={100}
              aria-labelledby='discrete-slider-small-steps'
              step={1}
              min={10}
              max={500}
              valueLabelDisplay='auto'
              onChange={(_event, value) => {
                onChange(value as number);
                changeWidth(value as number);
              }}
            />
          )}
        />
        <div>
          {uploading ? (
            <Box data-testid='uploading' p={'3px'}>
              <LinearProgress variant='determinate' value={uploadProgress} />
            </Box>
          ) : (
            <Box p={'5px'}></Box>
          )}
          <Button
            aria-label='save'
            id='save'
            color='primary'
            variant='contained'
            type='submit'
            disabled={uploading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
