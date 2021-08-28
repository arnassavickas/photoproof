import React from 'react'
import user from '@testing-library/user-event'
import { axe } from 'jest-axe'
import firebase from 'firebase'
import { noop } from 'lodash'

import { render, waitFor, screen } from '../../utils/customTestRenderer'
import SignIn from './SignIn'
import { auth } from '../../firebase'

describe('<SignIn/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(noop)
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
    const { container } = render(<SignIn />)

    expect(container).not.toHaveTextContent('Email is required')

    user.click(
      screen.getByRole('button', {
        name: /signIn/i,
      }),
    )

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  test('login fails with wrong credentials', async () => {
    // TODO find more elegant way to mock
    const mockHandler = jest.fn((email, password) => {
      if (email === 'correct' && password === 'correct') {
        return Promise.resolve(null as unknown as firebase.auth.UserCredential)
      }
      const error = new Error('incorrect credentials')
      error.code = 'auth/wrong-password'
      throw error
    })
    auth.signInWithEmailAndPassword = mockHandler

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
    expect(mockHandler.mock.calls).toHaveLength(1)
    mockHandler.mockRestore()
  })

  test('login works with correct implementation', async () => {
    const mockHandler = jest.fn((email, password) => {
      if (email === 'correct' && password === 'correct') {
        return Promise.resolve(null as unknown as firebase.auth.UserCredential)
      }
      throw new Error('incorrect credentials')
    })

    auth.signInWithEmailAndPassword = mockHandler

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
      expect(mockHandler.mock.calls).toHaveLength(1)
    })
    expect(screen.queryByText('Email or password is incorrect')).not.toBeInTheDocument()

    mockHandler.mockRestore()
  })
})
