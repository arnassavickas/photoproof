import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Checkbox, Typography, Button, TextField, FormControlLabel } from '@material-ui/core'
import { DropzoneArea } from 'material-ui-dropzone'
import { useSnackbar } from 'notistack'

import { NewCollectionInputs } from '../../types'
import { generateNewCollection } from '../../firebase'
import styles from './styles.module.scss'
import { setLoaderProgress } from '../../reducers/uiStateSlice'
import { RootState } from '../../store'

const NewCollection: React.FC = () => {
  const { register, handleSubmit, watch, errors, getValues, control } =
    useForm<NewCollectionInputs>()

  const dispatch = useDispatch()
  const progress = useSelector((state: RootState) => state.uiState.loaderProgress)

  const history = useHistory()

  const { enqueueSnackbar } = useSnackbar()

  const minToggle = watch('minSelectRequired')
  const maxToggle = watch('maxSelectRequired')

  const handleLoaderProgressChange = (progress: number) => {
    dispatch(setLoaderProgress(progress))
  }

  const onSubmit = async (data: NewCollectionInputs) => {
    try {
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
        handleLoaderProgressChange,
      )
      dispatch(setLoaderProgress(0))
      history.push(`/edit/${collectionId}`)
    } catch (err) {
      enqueueSnackbar('ERROR: Creating new collection failed', {
        variant: 'error',
      })
    }
  }

  return (
    <div>
      <Typography variant="h4">New collection</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="horizontalButtons">
            <Button to="/" component={Link} color="secondary" variant="contained">
              Cancel
            </Button>
            <Button
              aria-label="create"
              id="create"
              color="primary"
              variant="contained"
              type="submit"
              disabled={!!progress}
            >
              Create
            </Button>
          </div>
        </div>
        <TextField
          id="title"
          name="title"
          inputRef={register({ required: true, maxLength: 50 })}
          variant="outlined"
          label="Title"
          error={!!errors.title}
          helperText={errors.title ? 'Title is required' : ' '}
        />
        {/* TODO add watermark feature */}
        {/* <div>
          <FormControlLabel control={<Checkbox />} label='Apply watermark' />
        </div> */}
        <div>
          <FormControlLabel
            control={<Checkbox name="allowComments" inputRef={register} />}
            label="Allow comments"
          />
        </div>
        <Typography variant="body1">selection goals:</Typography>
        <div>
          <FormControlLabel
            control={<Checkbox name="minSelectRequired" inputRef={register} />}
            label="minimum"
          />
          <div style={{ display: minToggle ? 'inline' : 'none' }}>
            <TextField
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
              inputRef={register({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  lowerThanMax: value =>
                    !getValues('maxSelectRequired') || getValues('maxSelectGoal') >= value,
                },
              })}
              error={!!errors.minSelectGoal}
              helperText={errors.minSelectGoal && 'Must be higher than maximum value'}
            />
          </div>
        </div>
        <div>
          <FormControlLabel
            control={<Checkbox name="maxSelectRequired" inputRef={register} />}
            label="maximum"
          />
          <div style={{ display: maxToggle ? 'inline' : 'none' }}>
            <TextField
              data-testid="maxSelectGoal"
              name="maxSelectGoal"
              type="number"
              variant="outlined"
              size="small"
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
                  higherThanMin: value =>
                    !getValues('minSelectRequired') || getValues('minSelectGoal') <= value,
                },
              })}
              error={!!errors.maxSelectGoal}
              helperText={errors.maxSelectGoal && 'Must be higher than minimum value'}
            />
          </div>
        </div>
        <div className={styles.dropzoneError}>
          <Typography variant="body1">
            {errors.files ? 'Images are required' : <>&#8203;</>}
          </Typography>
        </div>
        <Controller
          name="files"
          control={control}
          defaultValue={[]}
          rules={{
            validate: {
              notEmpty: array => {
                return array.length > 0
              },
            },
          }}
          render={({ onChange }) => (
            <DropzoneArea
              acceptedFiles={['image/jpeg']}
              dropzoneText="Drop images or click to upload here"
              onChange={files => {
                return onChange([...files])
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
              showPreviews
              showFileNamesInPreview
              dropzoneClass={`dropzoneClass ${errors.files && styles.dropzoneErrorBorder}`}
              // @ts-ignore data-testid should be passable
              inputProps={{ 'data-testid': 'dropzone-input' }}
            />
          )}
        />
      </form>
    </div>
  )
}

export default NewCollection
