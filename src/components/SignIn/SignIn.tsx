import { Box, Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { auth } from '../../firebase';
import { useForm } from 'react-hook-form';

const SignIn = () => {
  const { register, handleSubmit, errors, setError } = useForm();

  const signInWithEmailAndPasswordHandler = async (data: any) => {
    try {
      await auth.signInWithEmailAndPassword(
        data.email,
        data.password
      );
    } catch (err) {
      setError('email', {
        message: ' ',
      });
      setError('password', {
        message: 'Email or password is incorrect',
      });
      console.error('error signing in with password and email', err);
      //TODO ERROR
    }
  };

  return (
    <div>
      <Typography variant='h4'>Sign In</Typography>
      <Box mt={3}>
        {
          <form onSubmit={handleSubmit(signInWithEmailAndPasswordHandler)}>
            <div>
              <TextField
                id='email'
                variant='outlined'
                name='email'
                label='Email'
                inputRef={register({ required: true })}
                error={!!errors.email}
                helperText={
                  errors.email
                    ? errors.email.message || 'Email is required'
                    : ' '
                }
              />
            </div>
            <div>
              <TextField
                id='password'
                type='password'
                variant='outlined'
                name='password'
                label='Password'
                inputRef={register({ required: true })}
                error={!!errors.password}
                helperText={
                  errors.password
                    ? errors.password.message || 'Password is required'
                    : ' '
                }
              />
            </div>
            <div>
              <Button
                aria-label='signIn'
                type='submit'
                variant='outlined'
              >
                Sign In
              </Button>
            </div>
          </form>
        }
      </Box>
    </div>
  );
};
export default SignIn;
