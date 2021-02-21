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

  test('has no violations', async () => {
    const { container, debug } = render(
      <Router>
        <NewCollection />
      </Router>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('entering invalid/missing data renders errors', async () => {
    const { getByLabelText, container, debug, getByRole, getByTestId } = render(
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

    const minSelectRequired = getByLabelText('minimum');
    user.click(minSelectRequired);
    const maxSelectRequired = getByLabelText('maximum');
    user.click(maxSelectRequired);
    const minSelectGoal = getByTestId(/minSelectGoal/i);
    user.type(minSelectGoal, '4');
    const maxSelectGoal = getByTestId(/maxSelectGoal/i);
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

    //TODO check if call is made

    await waitFor(() => {
      expect(container).not.toHaveTextContent('Title is required');
      expect(container).not.toHaveTextContent('Images are required');
    });
  });

  test('upload calls generateNewCollection one time', async () => {
    const { getByLabelText, container, getByText, findByText } = render(
      <Router>
        <NewCollection />
      </Router>
    );
    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.jpeg', { type: 'image/jpeg' }),
      new File([new ArrayBuffer(1)], 'file2.jpeg', { type: 'image/jpeg' }),
    ];

    const collectionTitle = getByLabelText(/title/i);
    user.type(collectionTitle, 'test title');

    const fileInput = container.querySelector('input[type="file"]');

    user.upload(fileInput as HTMLElement, filesToUplaod);

    await findByText('file1.jpeg');
    await findByText('file2.jpeg');

    const createButton = getByText('Create');
    user.click(createButton);

    await waitFor(() => {
      expect(generateNewCollection).toHaveBeenCalledTimes(1);
    });
  });
});
