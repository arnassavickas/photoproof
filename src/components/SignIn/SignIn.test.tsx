import React from 'react';

import { render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { axe } from 'jest-axe';
import SignIn from './SignIn';
import { auth } from '../../firebase';

describe('<SignIn/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('has no violations', async () => {
    const { container } = render(<SignIn />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('renders content', () => {
    const { getByLabelText, container, getByRole, debug } = render(<SignIn />);

    const title = container.querySelector('h4');
    expect(title).toHaveTextContent('Sign In');

    const email = getByLabelText(/email/i);
    expect(email).toBeDefined();

    const password = getByLabelText(/password/i);
    expect(password).toBeDefined();

    const signInButton = getByRole('button', {
      name: /signIn/i,
    });
    expect(signInButton).toHaveTextContent(/sign in/i);
  });

  test('displays errors', async () => {
    const { getAllByText, container } = render(<SignIn />);
    const signInButton = getAllByText('Sign In')
      ?.find((el) => el.closest('button') != null)
      ?.closest('button');
    expect(container).not.toHaveTextContent('Email is required');
    if (signInButton) {
      user.click(signInButton);
    }
    await waitFor(() => {
      expect(container).toHaveTextContent('Email is required');
      expect(container).toHaveTextContent('Password is required');
    });
  });

  test('login fails with wrong credentials', async () => {
    //TODO find more elegant way to mock
    const mockHandler = jest.fn((email, password) => {
      if (email === 'correct' && password === 'correct') {
        return Promise.resolve(
          (null as unknown) as firebase.auth.UserCredential
        );
      } else {
        throw new Error('incorrect credentials');
      }
    });
    auth.signInWithEmailAndPassword = mockHandler;

    const { getByLabelText, getAllByText, container } = render(<SignIn />);
    const email = getByLabelText(/email/i);
    user.type(email, 'incorrect');

    const password = getByLabelText(/password/i);
    user.type(password, 'incorrect');

    const signInButton = getAllByText('Sign In')
      ?.find((el) => el.closest('button') != null)
      ?.closest('button');

    if (signInButton) {
      user.click(signInButton);
    }

    await waitFor(() => {
      expect(mockHandler.mock.calls).toHaveLength(1);
      expect(container).toHaveTextContent('Email or password is incorrect');
    });
    mockHandler.mockRestore();
  });

  test('login works with correct implementation', async () => {
    const mockHandler = jest.fn((email, password) => {
      if (email === 'correct' && password === 'correct') {
        return Promise.resolve(
          (null as unknown) as firebase.auth.UserCredential
        );
      } else {
        throw new Error('incorrect credentials');
      }
    });

    auth.signInWithEmailAndPassword = mockHandler;

    const { getByLabelText, getAllByText, container } = render(<SignIn />);
    const email = getByLabelText(/email/i);
    user.type(email, 'correct');

    const password = getByLabelText(/password/i);
    user.type(password, 'correct');

    const signInButton = getAllByText('Sign In')
      ?.find((el) => el.closest('button') != null)
      ?.closest('button');

    if (signInButton) {
      user.click(signInButton);
    }

    await waitFor(() => {
      expect(mockHandler.mock.calls).toHaveLength(1);
      expect(container).not.toHaveTextContent('Email or password is incorrect');
    });
    mockHandler.mockRestore();
  });
});
