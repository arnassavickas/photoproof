import { Box, Button, TextField, Typography } from '@material-ui/core'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

import { auth } from '../../firebase'

const SignIn = () => {
  const { register, handleSubmit, errors, setError } = useForm()

  const { enqueueSnackbar } = useSnackbar()

  const signInWithEmailAndPasswordHandler = async (data: any) => {
    try {
      await auth.signInWithEmailAndPassword(data.email, data.password)
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('email', {
          message: ' ',
        })
        setError('password', {
          message: 'Email or password is incorrect',
        })
      } else {
        enqueueSnackbar('ERROR: Login failed', {
          variant: 'error',
        })
      }
    }
  }

  return (
    <div>
      <Typography variant="h4">Please sign in</Typography>
      <Box mt={3}>
        <form onSubmit={handleSubmit(signInWithEmailAndPasswordHandler)}>
          <div>
            <TextField
              id="email"
              variant="outlined"
              name="email"
              label="Email"
              inputRef={register({ required: true })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message || 'Email is required' : ' '}
            />
          </div>
          <div>
            <TextField
              id="password"
              type="password"
              variant="outlined"
              name="password"
              label="Password"
              inputRef={register({ required: true })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message || 'Password is required' : ' '}
            />
          </div>
          <div>
            <Button aria-label="signIn" type="submit" variant="outlined">
              Sign In
            </Button>
          </div>
        </form>
      </Box>
    </div>
  )
}
export default SignIn
