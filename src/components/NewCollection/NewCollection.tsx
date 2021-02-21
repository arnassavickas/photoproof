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
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import { NewCollectionInputs } from '../../types';
import { Fragment } from 'react';

const NewCollection: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    getValues,
    control,
  } = useForm<NewCollectionInputs>();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const history = useHistory();

  const minToggle = watch('minSelectRequired');
  const maxToggle = watch('maxSelectRequired');

  const onSubmit = async (data: NewCollectionInputs) => {
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
      setUploadProgress
    );
    setUploading(false);
    history.push(`/edit/${collectionId}`);
  };

  return (
    <div>
      <Button to='/' component={Link} variant='outlined'>
        Cancel
      </Button>
      <Typography variant='h4'>New collection</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Button
            aria-label='create'
            id='create'
            color='primary'
            variant='contained'
            type='submit'
          >
            Create
          </Button>
          {uploading ? (
            <Box data-testid='uploading' p={'3px'}>
              <LinearProgress variant='determinate' value={uploadProgress} />
            </Box>
          ) : (
            <Box p={'5px'}></Box>
          )}
        </div>
        <TextField
          id='title'
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
        <Typography variant='body1'>selection goals:</Typography>
        <div>
          <FormControlLabel
            control={<Checkbox name='minSelectRequired' inputRef={register} />}
            label='minSelectRequired'
          />
          <div style={{ display: minToggle ? 'inline' : 'none' }}>
            <TextField
              id='minSelectGoal'
              label='minSelectGoal'
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
            label='maxSelectRequired'
          />
          <div style={{ display: maxToggle ? 'inline' : 'none' }}>
            <TextField
              id='maxSelectGoal'
              label='maxSelectGoal'
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
        <div className={styles.dropzoneError}>
          <Typography variant='subtitle2'>
            {errors.files ? (
              'Images are required'
            ) : (
              <Fragment>&#8203;</Fragment>
            )}
          </Typography>
        </div>
        <Controller
          name='files'
          control={control}
          defaultValue={[]}
          rules={{
            validate: {
              notEmpty: (array) => {
                return array.length > 0;
              },
            },
          }}
          render={({ onChange }) => (
            <DropzoneArea
              acceptedFiles={['image/jpeg']}
              dropzoneText={'Drop images or click to upload here'}
              onChange={(files) => {
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
              dropzoneClass={`dropzoneClass ${
                errors.files && styles.dropzoneErrorBorder
              }`}
            />
          )}
        />
      </form>
    </div>
  );
};

export default NewCollection;
