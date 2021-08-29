import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Button, Typography, Slider, Box, TextField } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import { changeSiteSettings } from '../../firebase'

import styles from './styles.module.scss'
import { RootState } from '../../store'
import { setLogoUrl, setLogoWidth } from '../../reducers/siteSettingsSlice'
import { setLoaderProgress, setUiState } from '../../reducers/uiStateSlice'
import { UiState } from '../../types'

// TODO implement interactive watermark size/angle adjustment

const Settings = () => {
  const { register, handleSubmit, control, errors, setValue } = useForm<{
    logoFile: FileList
    logoWidth: number
    email: string
  }>()

  const dispatch = useDispatch()
  const { logoWidth, email } = useSelector((state: RootState) => state.siteSettings)
  const progress = useSelector((state: RootState) => state.uiState.loaderProgress)

  const history = useHistory()

  const initialWidth = useRef<number>()

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    setValue('email', email)
    setValue('logoWidth', logoWidth)
    dispatch(setUiState(UiState.Success))
  }, [dispatch, email, logoWidth, setValue])

  const handleLoaderProgress = (progress: number) => {
    dispatch(setLoaderProgress(progress))
  }

  const onSubmit = async (data: { logoFile: FileList; logoWidth: number; email: string }) => {
    try {
      await changeSiteSettings(data.logoFile, data.logoWidth, data.email, handleLoaderProgress)

      dispatch(setLoaderProgress(0))
      history.push('/')
    } catch {
      enqueueSnackbar('ERROR: Saving settings failed', {
        variant: 'error',
      })
    }
  }

  const displayImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      dispatch(setLogoUrl(URL.createObjectURL(event.target.files[0])))
    }
  }

  const changeWidth = (value: number) => {
    if (!initialWidth.current) {
      initialWidth.current = logoWidth
    }
    dispatch(setLogoWidth(value))
  }

  const handleCancel = () => {
    history.push('/')
    if (initialWidth.current) dispatch(setLogoWidth(initialWidth.current))
  }

  return (
    <div>
      <Typography variant="h4">Settings</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="horizonalButtons">
          <Button onClick={handleCancel} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button
            aria-label="save"
            id="save"
            variant="contained"
            color="primary"
            type="submit"
            disabled={!!progress}
          >
            Save
          </Button>
        </div>
        <div className={styles.dropzoneError}>
          <Typography variant="body1">
            {errors.logoFile ? 'Images are required' : <>&#8203;</>}
          </Typography>
        </div>
        <Typography variant="h6">Select new logo:</Typography>
        <Button className={styles.fileInputBtn} variant="outlined">
          <input
            name="logoFile"
            ref={register}
            type="file"
            className={styles.customFileInput}
            onChange={displayImg}
            data-testid="settings-file-upload"
          />
          Upload
        </Button>
        <Typography variant="h6">Select logo width:</Typography>
        <Controller
          name="logoWidth"
          control={control}
          defaultValue={0}
          render={({ onChange }) => (
            <Box>
              <Slider
                className={styles.slider}
                ref={register}
                defaultValue={initialWidth.current}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                min={0}
                max={500}
                valueLabelDisplay="auto"
                onChange={(_event, value) => {
                  onChange(value as number)
                  changeWidth(value as number)
                }}
                color="secondary"
                value={logoWidth}
              />
            </Box>
          )}
        />
        <TextField
          label="Owner's email"
          id="email"
          name="email"
          variant="outlined"
          inputRef={register({ required: true, maxLength: 50 })}
          error={!!errors.email}
          helperText={errors.email ? 'Email is required' : ' '}
          placeholder="name@email.com"
          inputProps={{ type: 'email' }}
          defaultValue={email}
        />
      </form>
    </div>
  )
}

export default Settings
