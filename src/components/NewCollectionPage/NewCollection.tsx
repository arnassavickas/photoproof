import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Link, useHistory } from 'react-router-dom';
import { generateNewCollection } from '../../firebase';
import { useForm, Controller } from 'react-hook-form';
import {
  Checkbox,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  LinearProgress,
  Box,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

type Inputs = {
  files: FileList;
  title: string;
  minSelectRequired: boolean;
  minSelectGoal: number;
  maxSelectRequired: boolean;
  maxSelectGoal: number;
  allowComments: boolean;
};

const NewCollection: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    getValues,
    control,
  } = useForm<Inputs>();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUplaodProgress] = useState(0);
  const [thumbnailReady, setThumbnailReady] = useState(true);
  const history = useHistory();

  const minToggle = watch('minSelectRequired');
  const maxToggle = watch('maxSelectRequired');

  const onSubmit = async (data: Inputs) => {
    console.log(data);
    setUploading(true);
    const collectionId = await generateNewCollection(
      {
        title: data.title,
        minSelect: {
          required: data.minSelectRequired,
          goal: data.minSelectGoal,
        },
        maxSelect: {
          required: data.maxSelectRequired,
          goal: data.maxSelectGoal,
        },
        allowComments: data.allowComments,
      },
      data.files,
      setUplaodProgress
    );
    setUploading(false);
    setThumbnailReady(false);
    history.push(`/edit/${collectionId}`);
  };

  if (!thumbnailReady) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />.
      </Backdrop>
    );
  }

  return (
    <div>
      <Button to='/' component={Link} variant='outlined'>
        Cancel
      </Button>
      <Typography variant='h4'>new collection</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Button color='primary' variant='contained' type='submit'>
            Create
          </Button>
          {uploading ? (
            <Box p={'3px'}>
              <LinearProgress variant='determinate' value={uploadProgress} />
            </Box>
          ) : (
            <Box p={'5px'}></Box>
          )}
        </div>
        <TextField
          name='title'
          inputRef={register({ required: true, maxLength: 50 })}
          variant='outlined'
          label='Title'
          error={!!errors.title}
          helperText={errors.title ? 'Title is required' : ' '}
        />
        <div>
          <FormControlLabel control={<Checkbox />} label='Apply watermark' />
        </div>
        <div>
          <FormControlLabel
            control={<Checkbox name='allowComments' inputRef={register} />}
            label='Allow comments'
          />
        </div>
        <Typography variant='subtitle1'>selection goals:</Typography>
        <div>
          <FormControlLabel
            control={<Checkbox name='minSelectRequired' inputRef={register} />}
            label='minimum'
          />
          <div style={{ display: minToggle ? 'inline' : 'none' }}>
            <TextField
              name='minSelectGoal'
              type='number'
              variant='outlined'
              size='small'
              InputProps={{
                inputProps: {
                  max: 999,
                  min: 1,
                },
              }}
              inputRef={register({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  lowerThanMax: (value) =>
                    !getValues('maxSelectRequired') ||
                    getValues('maxSelectGoal') >= value,
                },
              })}
              error={!!errors.minSelectGoal}
              helperText={
                errors.minSelectGoal && 'Must be higher than maximum value'
              }
            />
          </div>
        </div>
        <div>
          <FormControlLabel
            control={<Checkbox name='maxSelectRequired' inputRef={register} />}
            label='maximum'
          />
          <div style={{ display: maxToggle ? 'inline' : 'none' }}>
            <TextField
              name='maxSelectGoal'
              type='number'
              variant='outlined'
              size='small'
              InputProps={{
                inputProps: {
                  max: 999,
                  min: 1,
                },
              }}
              inputRef={register({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  higherThanMin: (value) =>
                    !getValues('minSelectRequired') ||
                    getValues('minSelectGoal') <= value,
                },
              })}
              error={!!errors.maxSelectGoal}
              helperText={
                errors.maxSelectGoal && 'Must be higher than minimum value'
              }
            />
          </div>
        </div>
        <Controller
          name='files'
          control={control}
          render={({ onChange }) => (
            <DropzoneArea
              acceptedFiles={['image/jpeg']}
              dropzoneText={'Drop images or click to upload here'}
              onChange={(files) => {
                console.log(files);
                return onChange([...files]);
              }}
              filesLimit={999}
              previewGridClasses={{
                item: 'itemReference',
              }}
              previewGridProps={{
                container: {
                  spacing: 1,
                },
                item: { sm: 2, lg: 1, md: 1 },
              }}
              showAlerts={false}
              showPreviewsInDropzone={false}
              showPreviews={true}
              showFileNamesInPreview={true}
              dropzoneClass={'dropzoneClass'}
            />
          )}
        />
      </form>
    </div>
  );
};

export default NewCollection;
