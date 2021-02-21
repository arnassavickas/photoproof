import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import AddPhotosDialog from './AddPhotosDialog';
import { getSingleCollection, addMorePhotos } from '../../../firebase';

jest.mock('../../../firebase');

describe('<NewCollection/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('', async () => {
    const { getByLabelText, container, getByText, findByText } = render(
      <AddPhotosDialog />
    );
  });
});
