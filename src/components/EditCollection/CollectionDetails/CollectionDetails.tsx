import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { Collection, CollectionDetailsProps } from '../../../types';
import { collectionStatus, updateSettings } from '../../../firebase';
import {
  Checkbox,
  Typography,
  Tooltip,
  Button,
  TextField,
  FormControlLabel,
  Paper,
} from '@material-ui/core';

import { useForm, Controller } from 'react-hook-form';

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  collectionId,
  collection,
  setCollection,
  filteredPhotos,
  setConfirmationDialogOpen,
  setConfirmationDialogTitle,
  setConfirmationDialogContentText,
  setConfirmationDialogAgree,
  setProgress,
}) => {
  const [copied, setCopied] = useState(false);

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    watch: watchSettings,
    errors: errorsSettings,
    getValues: getValuesSettings,
    setValue: setValueSettings,
    reset: resetSettings,
    control: controlSettings,
  } = useForm();

  const minToggle = watchSettings('minSelectRequired');
  const maxToggle = watchSettings('maxSelectRequired');

  useEffect(() => {
    if (collection) {
      resetSettings({
        title: collection.title,
        allowComments: collection.allowComments,
        maxSelectRequired: collection.maxSelect.required,
        minSelectRequired: collection.minSelect.required,
        minSelectGoal: collection.minSelect.goal,
        maxSelectGoal: collection.maxSelect.goal,
      });
      setValueSettings('allowComments', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, resetSettings]);

  const copyUrl = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const button = e.target as HTMLElement;
    navigator.clipboard.writeText(button.innerHTML);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const changeStatus = async (status: Collection['status']) => {
    try {
      await collectionStatus(collectionId, status);
      if (collection) {
        setCollection({ ...collection, status });
      }
    } catch (err) {
      //
    }
    resetDialog();
  };

  const onSubmitSettings = async (data: any) => {
    try {
      await updateSettings(
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
        collectionId
      );
      if (collection) {
        setCollection({
          ...collection,
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
          status: 'selecting',
        });
      }
    } catch (err) {
      //
    }
  };

  const copySelections = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (collection) {
      const filenames = collection.photos
        .filter((photo) => photo.selected)
        .map((photo) => photo.filename);

      navigator.clipboard.writeText(filenames.join(' '));
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    resetDialog();
  };

  const confirmEdit = () => {
    setConfirmationDialogOpen(true);
    setConfirmationDialogTitle('This collection is already confirmed');
    setConfirmationDialogContentText(
      'Do you really want to edit an already confirmed collection?'
    );
    setConfirmationDialogAgree(() => () => changeStatus('editing'));
  };

  const confirmCopy = () => {
    setConfirmationDialogOpen(true);
    setConfirmationDialogTitle('This collection is not yet confirmed');
    setConfirmationDialogContentText(
      'Do you really want to copy selections from an unconfirmed collection?'
    );
    setConfirmationDialogAgree(() => copySelections);
  };

  const resetDialog = () => {
    setConfirmationDialogOpen(false);
    setConfirmationDialogTitle('');
    setConfirmationDialogContentText('');
    setConfirmationDialogAgree(() => {});
    setProgress(0);
  };

  const selectedPhotos = collection?.photos.filter((photo) => photo.selected)
    .length;

  return (
    <div>
      <form onSubmit={handleSubmitSettings(onSubmitSettings)}>
        {collection.status !== 'editing' ? (
          <Button
            variant='outlined'
            onClick={
              collection.status === 'confirmed'
                ? confirmEdit
                : () => changeStatus('editing')
            }
          >
            Edit
          </Button>
        ) : (
          <Button color='primary' variant='contained' type='submit'>
            Save
          </Button>
        )}
        {collection.status === 'editing' ? (
          <div>
            <TextField
              label='Title'
              name='title'
              defaultValue={collection.title}
              variant='outlined'
              classes={{ root: styles.titleTextarea }}
              margin='dense'
              inputRef={registerSettings({ required: true, maxLength: 50 })}
              error={!!errorsSettings.title}
              helperText={errorsSettings.title ? 'Title is required' : ' '}
            />
          </div>
        ) : (
          <Typography variant='h4'>{collection.title}</Typography>
        )}

        <Typography>
          Client URL:{' '}
          <Tooltip title={copied ? 'copied!' : 'copy'}>
            <Button onClick={copyUrl}>
              {`${window.location.origin.toString()}/collection/${collectionId}`}{' '}
            </Button>
          </Tooltip>
          <Button
            to={`/collection/${collectionId}`}
            component={Link}
            variant='outlined'
            size='small'
          >
            View
          </Button>
        </Typography>
        <Typography>Status: {collection.status} </Typography>
        {collection.status === 'confirmed' ? (
          <Typography>Final comment: {collection.finalComment}</Typography>
        ) : null}
        <Typography variant='h6'>Settings:</Typography>
        <div>
          <FormControlLabel
            control={
              <Controller
                control={controlSettings}
                name='allowComments'
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Checkbox
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value}
                    inputRef={ref}
                    disabled={collection.status !== 'editing'}
                  />
                )}
              />
            }
            label='Allow comments'
          />
        </div>
        <Typography variant='subtitle1'>selection goals:</Typography>
        <div>
          <FormControlLabel
            control={
              <Controller
                control={controlSettings}
                name='minSelectRequired'
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Checkbox
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value}
                    inputRef={ref}
                    disabled={collection.status !== 'editing'}
                  />
                )}
              />
            }
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
              inputRef={registerSettings({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  lowerThanMax: (value) =>
                    !getValuesSettings('maxSelectRequired') ||
                    getValuesSettings('maxSelectGoal') >= value,
                },
              })}
              error={!!errorsSettings.minSelectGoal}
              helperText={
                errorsSettings.minSelectGoal &&
                'Must be higher than maximum value'
              }
              disabled={collection.status !== 'editing'}
            />
          </div>
        </div>
        <div>
          <FormControlLabel
            control={
              <Controller
                control={controlSettings}
                name='maxSelectRequired'
                render={(
                  { onChange, onBlur, value, name, ref },
                  { invalid, isTouched, isDirty }
                ) => (
                  <Checkbox
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value}
                    inputRef={ref}
                    disabled={collection.status !== 'editing'}
                  />
                )}
              />
            }
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
              inputRef={registerSettings({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  higherThanMin: (value) =>
                    !getValuesSettings('minSelectRequired') ||
                    getValuesSettings('minSelectGoal') <= value,
                },
              })}
              error={!!errorsSettings.maxSelectGoal}
              helperText={
                errorsSettings.maxSelectGoal &&
                'Must be higher than minimum value'
              }
              disabled={collection.status !== 'editing'}
            />
          </div>
        </div>
      </form>
      <Paper elevation={3} className={styles.centeredContainer}>
        <Typography variant='h6'>Selected:</Typography>
        <Typography variant='subtitle1'>
          {selectedPhotos}/{collection.photos.length}
        </Typography>
        <Tooltip title={copied ? 'copied!' : 'copy'}>
          <Button
            onClick={
              collection.status === 'confirmed' ? copySelections : confirmCopy
            }
            variant='outlined'
          >
            Copy selections
          </Button>
        </Tooltip>
      </Paper>
    </div>
  );
};

export default CollectionDetails;
