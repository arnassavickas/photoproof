import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Checkbox,
  Typography,
  Tooltip,
  Button,
  TextField,
  FormControlLabel,
  Paper,
  Box,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { noop } from 'lodash'

import { useForm, Controller } from 'react-hook-form'

import { useSnackbar } from 'notistack'

import styles from './styles.module.scss'
import { Collection, CollectionDetailsProps } from '../../../types'
import { changeCollectionStatus, reorderPhotos, updateSettings } from '../../../firebase'
import StatusIcon from '../../StatusIcon/StatusIcon'
import { RootState } from '../../../store'
import { setCollection, setReorderPending } from '../../../reducers/singleCollectionSlice'
import { setLoaderProgress } from '../../../reducers/uiStateSlice'

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  setConfirmationDialogOpen,
  setConfirmationDialogTitle,
  setConfirmationDialogContentText,
  setConfirmationDialogAgree,
}) => {
  const [copied, setCopied] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const collection = useSelector((state: RootState) => state.singleCollection.collection)
  const reorderPending = useSelector((state: RootState) => state.singleCollection.reorderPending)

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    watch: watchSettings,
    errors: errorsSettings,
    getValues: getValuesSettings,
    setValue: setValueSettings,
    control: controlSettings,
  } = useForm({
    defaultValues: {
      title: collection?.title,
      allowComments: collection?.allowComments,
      maxSelectRequired: collection?.maxSelect.required,
      minSelectRequired: collection?.minSelect.required,
      minSelectGoal: collection?.minSelect.goal,
      maxSelectGoal: collection?.maxSelect.goal,
    },
  })

  useEffect(() => {
    setValueSettings('title', collection?.title)
    setValueSettings('allowComments', collection?.allowComments)
    setValueSettings('maxSelectRequired', collection?.maxSelect.required)
    setValueSettings('minSelectRequired', collection?.minSelect.required)
    setValueSettings('minSelectGoal', collection?.minSelect.goal)
    setValueSettings('maxSelectGoal', collection?.maxSelect.goal)
  }, [collection, setValueSettings])

  if (!collection) return null

  const minToggle = watchSettings('minSelectRequired')
  const maxToggle = watchSettings('maxSelectRequired')

  const copyUrl = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const button = event.target as HTMLElement
    navigator.clipboard.writeText(button.innerHTML)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const resetDialog = () => {
    setConfirmationDialogOpen(false)
    setConfirmationDialogTitle('')
    setConfirmationDialogContentText('')
    setConfirmationDialogAgree(noop)

    dispatch(setLoaderProgress(0))
  }

  const changeStatus = async (status: Collection['status']) => {
    try {
      await changeCollectionStatus(collection.id, status)
      if (collection) {
        dispatch(setCollection({ ...collection, status }))
      }
      resetDialog()
    } catch (err) {
      enqueueSnackbar('ERROR: Changing collection status failed', {
        variant: 'error',
      })
    }
  }

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
        collection.id,
      )

      if (reorderPending) {
        await reorderPhotos(collection.photos, collection.id)
        dispatch(setReorderPending(false))
      }

      if (collection) {
        dispatch(
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
          }),
        )
      }
    } catch (err) {
      enqueueSnackbar('ERROR: Saving collection settings failed', {
        variant: 'error',
      })
    }
  }

  const copySelections = () => {
    if (collection) {
      const filenames = collection.photos
        .filter(photo => photo.selected)
        .map(photo => photo.filename)

      navigator.clipboard.writeText(filenames.join(' '))
    }
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
    resetDialog()
  }

  const confirmEdit = () => {
    setConfirmationDialogOpen(true)
    setConfirmationDialogTitle('This collection is already confirmed')
    setConfirmationDialogContentText('Do you really want to edit an already confirmed collection')
    setConfirmationDialogAgree(() => () => changeStatus('editing'))
  }

  const confirmCopy = () => {
    setConfirmationDialogOpen(true)
    setConfirmationDialogTitle('This collection is not yet confirmed')
    setConfirmationDialogContentText(
      'Do you really want to copy selections from an unconfirmed collection',
    )
    setConfirmationDialogAgree(() => copySelections)
  }

  return (
    <div>
      <form onSubmit={handleSubmitSettings(onSubmitSettings)}>
        <div className="horizontalButtons">
          <Button to="/" component={Link} variant="outlined">
            Home
          </Button>
          {collection.status !== 'editing' ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={
                collection.status === 'confirmed' ? confirmEdit : () => changeStatus('editing')
              }
            >
              Edit
            </Button>
          ) : (
            <Button color="primary" variant="contained" type="submit">
              Save
            </Button>
          )}
        </div>

        {collection.status === 'editing' ? (
          <div>
            <TextField
              label="Title"
              id="title"
              name="title"
              defaultValue={collection.title}
              variant="outlined"
              classes={{ root: styles.titleTextarea }}
              margin="dense"
              inputRef={registerSettings({ required: true, maxLength: 50 })}
              error={!!errorsSettings.title}
              helperText={errorsSettings.title ? 'Title is required' : ' '}
              fullWidth
            />
          </div>
        ) : (
          <div className={styles.titleBar}>
            <StatusIcon status={collection.status} />
            <Typography variant="h4">{collection.title}</Typography>
          </div>
        )}

        <Typography>
          Client URL:
          <Tooltip title={copied ? 'copied!' : 'copy'}>
            <Button onClick={copyUrl}>
              {/* //TODO make subfolder Context or .env */}
              {`${window.location.origin.toString()}/photoproof/collection/${collection.id}`}
            </Button>
          </Tooltip>
          <Button
            to={`/collection/${collection.id}`}
            component={Link}
            variant="contained"
            size="small"
          >
            Open
          </Button>
        </Typography>

        <Box className={collection.status === 'editing' ? undefined : 'noPointerEvents'} mt={2}>
          <Typography variant="h6">Settings:</Typography>
          <div>
            <FormControlLabel
              control={
                <Controller
                  control={controlSettings}
                  name="allowComments"
                  render={({ onChange, onBlur, value, ref }) => (
                    <Checkbox
                      onBlur={onBlur}
                      onChange={event => onChange(event.target.checked)}
                      checked={value}
                      inputRef={ref}
                      disabled={collection.status !== 'editing'}
                      color="default"
                    />
                  )}
                />
              }
              label="Allow comments"
            />
          </div>
          <Typography variant="subtitle1">selection goals:</Typography>
          <div>
            <FormControlLabel
              control={
                <Controller
                  control={controlSettings}
                  name="minSelectRequired"
                  render={({ onChange, onBlur, value, ref }) => (
                    <Checkbox
                      onBlur={onBlur}
                      onChange={event => onChange(event.target.checked)}
                      checked={value}
                      inputRef={ref}
                      disabled={collection.status !== 'editing'}
                      color="default"
                    />
                  )}
                />
              }
              label="Minimum"
            />
            <div style={{ display: minToggle ? 'inline' : 'none' }}>
              <TextField
                inputProps={{ 'data-testid': 'minSelectGoal' }}
                data-testid="minSelectGoal"
                name="minSelectGoal"
                type="number"
                variant="outlined"
                size="small"
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
                    lowerThanMax: value =>
                      !getValuesSettings('maxSelectRequired') ||
                      !getValuesSettings('minSelectRequired') ||
                      (getValuesSettings('maxSelectGoal') || 0) >= value,
                  },
                })}
                error={!!errorsSettings.minSelectGoal}
                helperText={errorsSettings.minSelectGoal && 'Must be higher than maximum value'}
                disabled={collection.status !== 'editing'}
              />
            </div>
          </div>
          <div>
            <FormControlLabel
              control={
                <Controller
                  control={controlSettings}
                  name="maxSelectRequired"
                  render={({ onChange, onBlur, value, ref }) => (
                    <Checkbox
                      onBlur={onBlur}
                      onChange={event => onChange(event.target.checked)}
                      checked={value}
                      inputRef={ref}
                      disabled={collection.status !== 'editing'}
                      color="default"
                    />
                  )}
                />
              }
              label="Maximum"
            />
            <div style={{ display: maxToggle ? 'inline' : 'none' }}>
              <TextField
                name="maxSelectGoal"
                label="maxSelectGoal"
                type="number"
                variant="outlined"
                size="small"
                InputProps={{
                  inputProps: {
                    max: 999,
                    min: 1,
                    'data-testid': 'maxSelectGoal',
                  },
                }}
                inputRef={registerSettings({
                  min: '1',
                  max: '999',
                  valueAsNumber: true,
                  validate: {
                    higherThanMin: value =>
                      !getValuesSettings('minSelectRequired') ||
                      !getValuesSettings('maxSelectRequired') ||
                      (getValuesSettings('minSelectGoal') || 0) <= value,
                  },
                })}
                error={!!errorsSettings.maxSelectGoal}
                helperText={errorsSettings.maxSelectGoal && 'Must be higher than minimum value'}
                disabled={collection.status !== 'editing'}
              />
            </div>
          </div>
        </Box>
      </form>
      <Paper elevation={3} className={styles.centeredContainer}>
        {collection.status === 'confirmed' ? (
          <Typography>Final comment: {collection.finalComment}</Typography>
        ) : null}
        <Tooltip title={copied ? 'copied!' : 'copy'}>
          <Button
            onClick={collection.status === 'confirmed' ? copySelections : confirmCopy}
            variant="outlined"
          >
            Copy selections
          </Button>
        </Tooltip>
      </Paper>
    </div>
  )
}

export default CollectionDetails
