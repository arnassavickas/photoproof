import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor, screen } from '../../utils/customTestRenderer';
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
    const { container } = render(
      <Router>
        <NewCollection />
      </Router>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('entering invalid/missing data renders errors', async () => {
    const { container} = render(
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

    const minSelectRequired = screen.getByLabelText('minimum');
    user.click(minSelectRequired);
    const maxSelectRequired = screen.getByLabelText('maximum');
    user.click(maxSelectRequired);
    const minSelectGoal = screen.getByTestId(/minSelectGoal/i);
    user.type(minSelectGoal, '4');
    const maxSelectGoal = screen.getByTestId(/maxSelectGoal/i);
    user.type(maxSelectGoal, '3');

    const create = screen.getByRole('button', { name: 'create' });
    user.click(create);

    await waitFor(() => {
      expect(container).toHaveTextContent('Title is required');
      expect(container).toHaveTextContent('Must be higher than maximum value');
      expect(container).toHaveTextContent('Must be higher than minimum value');
      expect(container).toHaveTextContent('Images are required');
    });
  });

  test('upload calls generateNewCollection one time', async () => {
    const { container} = render(
      <Router>
        <NewCollection />
      </Router>
    );
    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.jpeg', { type: 'image/jpeg' }),
      new File([new ArrayBuffer(1)], 'file2.jpeg', { type: 'image/jpeg' }),
    ];

    const collectionTitle = screen.getByLabelText(/title/i);
    user.type(collectionTitle, 'test title');

    const fileInput = container.querySelector('input[type="file"]');

    user.upload(fileInput as HTMLElement, filesToUplaod);

    await screen.findByText('file1.jpeg');
    await screen.findByText('file2.jpeg');

    const createButton = screen.getByText('Create');
    user.click(createButton);

    await waitFor(() => {
      expect(generateNewCollection).toHaveBeenCalledTimes(1);
    });
  });
});
