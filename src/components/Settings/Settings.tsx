import React, { useState, useRef, Fragment } from 'react';
import styles from './styles.module.scss';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Typography,
  Slider,
  Box,
  LinearProgress,
} from '@material-ui/core';
import { changeSiteSettings } from '../../firebase';
import { SettingsProps } from '../../types';

//TODO implement interactive watermark size/angle adjustment

const Settings: React.FC<SettingsProps> = ({
  logoWidth,
  setLogoUrl,
  setLogoWidth,
}) => {
  const { register, handleSubmit, control, errors } = useForm<{
    logoFile: FileList;
    logoWidth: number;
  }>();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const history = useHistory();
  const defaultWidth = useRef(logoWidth);

  const onSubmit = async (data: { logoFile: FileList; logoWidth: number }) => {
    setUploading(true);
    await changeSiteSettings(data.logoFile, data.logoWidth, setUploadProgress);
    setUploading(false);
    history.push('/');
  };

  const displayImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files) {
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const changeWidth = (value: number) => {
    setLogoWidth(value);
  };

  const handleCancel = () => {
    history.push('/');
    setLogoWidth(defaultWidth.current);
  };

  return (
    <div>
      <Typography variant='h4'>Settings</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='horizonalButtons'>
          <Button onClick={handleCancel} color='secondary' variant='contained'>
            Cancel
          </Button>{' '}
          <Button
            aria-label='save'
            id='save'
            variant='contained'
            color='primary'
            type='submit'
            disabled={uploading}
          >
            Save
          </Button>
        </div>
        <div className={styles.dropzoneError}>
          <Typography variant='body1'>
            {errors.logoFile ? (
              'Images are required'
            ) : (
              <Fragment>&#8203;</Fragment>
            )}
          </Typography>
        </div>
        <Typography variant='h6'>Select new logo:</Typography>
        <Button className={styles.fileInputBtn} variant='outlined'>
          <input
            name='logoFile'
            ref={register}
            type='file'
            className={styles.customFileInput}
            onChange={displayImg}
          />
          Upload
        </Button>
        <Typography variant='h6'>Select logo width:</Typography>
        <Controller
          name='logoWidth'
          control={control}
          defaultValue={defaultWidth.current}
          render={({ onChange }) => (
            <Box>
              <Slider
                className={styles.slider}
                ref={register}
                defaultValue={defaultWidth.current}
                aria-labelledby='discrete-slider-small-steps'
                step={1}
                min={0}
                max={500}
                valueLabelDisplay='auto'
                onChange={(_event, value) => {
                  onChange(value as number);
                  changeWidth(value as number);
                }}
                color='secondary'
              />
            </Box>
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
        </div>
      </form>
    </div>
  );
};

export default Settings;
