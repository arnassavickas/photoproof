import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  let history = useHistory();

  const signInWithEmailAndPasswordHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    email: string,
    password: string
  ) => {
    event.preventDefault();

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      setError('error signin in with password and email');
      console.error('error signin in with password and email', err);
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <div>
        {error !== null && <div>{error}</div>}
        <form className=''>
          <label htmlFor='userEmail' className='block'>
            Email:
          </label>
          <input
            type='email'
            className='my-1 p-1 w-full'
            name='userEmail'
            value={email}
            placeholder='E.g: faruq123@gmail.com'
            id='userEmail'
            onChange={(event) => onChangeHandler(event)}
          />
          <label htmlFor='userPassword' className='block'>
            Password:
          </label>
          <input
            type='password'
            name='userPassword'
            value={password}
            placeholder='Your Password'
            id='userPassword'
            onChange={(event) => onChangeHandler(event)}
          />
          <button
            onClick={(event) => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
