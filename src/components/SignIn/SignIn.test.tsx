import React from 'react'
import user from '@testing-library/user-event'
import { axe } from 'jest-axe'
import firebase from 'firebase'

import { render, waitFor, screen } from '../../utils/customTestRenderer'
import SignIn from './SignIn'
import { auth } from '../../firebase'

describe('<SignIn/>', () => {
  const signInWithEmailAndPassword = jest.spyOn(auth, 'signInWithEmailAndPassword')

  beforeEach(() => {
    signInWithEmailAndPassword.mockImplementation((email, password) => {
      if (email === 'correct' && password === 'correct') {
        return Promise.resolve(null as unknown as firebase.auth.UserCredential)
      }
      const error = new Error('incorrect credentials')
      // @ts-ignore adds special firestore modifier
      error.code = 'auth/wrong-password'
      throw error
    })
  })

  test('has no violations', async () => {
    const { container } = render(<SignIn />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('renders content', () => {
    render(<SignIn />)

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /signIn/i,
      }),
    ).toBeInTheDocument()
  })

  test('displays errors', async () => {
    render(<SignIn />)

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()

    user.click(
      screen.getByRole('button', {
        name: /signIn/i,
      }),
    )

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  test('login fails with wrong credentials', async () => {
    render(<SignIn />)
    const email = screen.getByLabelText(/email/i)
    user.paste(email, 'incorrect')

    const password = screen.getByLabelText(/password/i)
    user.paste(password, 'incorrect')

    user.click(
      screen.getByRole('button', {
        name: /signIn/i,
      }),
    )

    expect(await screen.findByText('Email or password is incorrect')).toBeInTheDocument()
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1)
  })

  test('login works with correct implementation', async () => {
    render(<SignIn />)

    const email = screen.getByLabelText(/email/i)
    user.paste(email, 'correct')

    const password = screen.getByLabelText(/password/i)
    user.paste(password, 'correct')

    user.click(
      screen.getByRole('button', {
        name: /signIn/i,
      }),
    )

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1)
    })
    expect(screen.queryByText('Email or password is incorrect')).not.toBeInTheDocument()
  })
})
