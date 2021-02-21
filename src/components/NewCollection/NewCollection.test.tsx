import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { axe } from 'jest-axe';
import NewCollection from './NewCollection';
import { generateNewCollection } from '../../firebase';

jest.mock('../../firebase');

describe('<NewCollection/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test.skip('has no violations', async () => {
    const { container, debug } = render(
      <Router>
        <NewCollection />
      </Router>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('renders content', () => {
    const { getByLabelText, container, debug } = render(
      <Router>
        <NewCollection />
      </Router>
    );

    const title = container.querySelector('h4');
    expect(title).toHaveTextContent(/new collection/i);

    const collectionTitle = getByLabelText(/title/i);
    expect(collectionTitle).toBeDefined();

    const allowComments = getByLabelText(/allow comments/i);
    expect(allowComments).toBeDefined();

    const minSelectRequired = getByLabelText(/minSelectRequired/i);
    expect(minSelectRequired).toBeDefined();

    const minSelectGoal = getByLabelText(/minSelectGoal/i);
    expect(
      minSelectGoal.closest('div')?.parentElement?.parentElement
    ).toHaveStyle({ display: 'none' });

    const maxSelectRequired = getByLabelText(/maxSelectRequired/i);
    expect(maxSelectRequired).toBeDefined();

    const maxSelectGoal = getByLabelText(/maxSelectGoal/i);
    expect(
      maxSelectGoal.closest('div')?.parentElement?.parentElement
    ).toHaveStyle({ display: 'none' });

    const create = container.querySelector('#create');
    expect(create).toHaveTextContent(/create/i);
  });

  test('minSelectRequired and maxSelectRequired checkboxes click changes the style', () => {
    const { getByLabelText, container, debug } = render(
      <Router>
        <NewCollection />
      </Router>
    );

    const minSelectRequired = getByLabelText(/minSelectRequired/i);
    user.click(minSelectRequired);

    const minSelectGoal = getByLabelText(/minSelectGoal/i);
    expect(
      minSelectGoal.closest('div')?.parentElement?.parentElement
    ).not.toHaveStyle({ display: 'none' });

    const maxSelectRequired = getByLabelText(/maxSelectRequired/i);
    user.click(maxSelectRequired);

    const maxSelectGoal = getByLabelText(/maxSelectGoal/i);
    expect(
      maxSelectGoal.closest('div')?.parentElement?.parentElement
    ).not.toHaveStyle({ display: 'none' });
  });

  test('entering invalid/missing data renders errors', async () => {
    const { getByLabelText, container, debug, getByRole } = render(
      <Router>
        <NewCollection />
      </Router>
    );

    expect(container).not.toHaveTextContent('Title is required');
    expect(container).not.toHaveTextContent(
      'Must be higher than maximum value'
    );
    expect(container).not.toHaveTextContent(
      'Must be higher than minimum value'
    );
    expect(container).not.toHaveTextContent('Images are required');

    const minSelectRequired = getByLabelText(/minSelectRequired/i);
    user.click(minSelectRequired);
    const maxSelectRequired = getByLabelText(/maxSelectRequired/i);
    user.click(maxSelectRequired);
    const minSelectGoal = getByLabelText(/minSelectGoal/i);
    user.type(minSelectGoal, '4');
    const maxSelectGoal = getByLabelText(/maxSelectGoal/i);
    user.type(maxSelectGoal, '3');

    const create = getByRole('button', { name: 'create' });
    user.click(create);

    await waitFor(() => {
      expect(container).toHaveTextContent('Title is required');
      expect(container).toHaveTextContent('Must be higher than maximum value');
      expect(container).toHaveTextContent('Must be higher than minimum value');
      expect(container).toHaveTextContent('Images are required');
    });
  });
  test('entering valid renders no errors', async () => {
    const { getByLabelText, container, getByRole, debug } = render(
      <Router>
        <NewCollection />
      </Router>
    );

    const create = getByRole('button', { name: 'create' });
    user.click(create);
    await waitFor(() => {
      expect(container).toHaveTextContent('Title is required');
      expect(container).toHaveTextContent('Images are required');
    });

    const collectionTitle = getByLabelText(/title/i);
    user.type(collectionTitle, 'test title');

    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      user.upload(
        fileInput,
        new File(['hello'], 'hello.jpg', { type: 'image/jpeg' })
      );
    }
    user.click(create);

    await waitFor(() => {
      expect(container).not.toHaveTextContent('Title is required');
      expect(container).not.toHaveTextContent('Images are required');
    });
  });

  test.skip('upload calls generateNewCollection one time', async () => {
    const { getByLabelText, container, getByRole, findByTestId } = render(
      <Router>
        <NewCollection />
      </Router>
    );

    const collectionTitle = getByLabelText(/title/i);
    user.type(collectionTitle, 'test title');

    const fileInput = container.querySelector('input[type="file"]');
    await waitFor(() => {
      if (fileInput) {
        user.upload(fileInput, [
          new File([new ArrayBuffer(1)], 'file.jpg', { type: 'image/jpeg' }),
          new File([new ArrayBuffer(1)], 'file.jpg', { type: 'image/jpeg' }),
        ]);
      }
    });
    const create = getByRole('button', { name: 'create' });
    user.click(create);

    //TODO react-hook-form throws validation error on files,
    //because it sees empty file array.
    //works if files input is not required

    // await waitFor(() => {
    //   expect(generateNewCollection).toHaveBeenCalledTimes(1);
    // });
  });
});
