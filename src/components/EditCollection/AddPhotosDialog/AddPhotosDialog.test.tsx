import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { AddPhotosDialogProps } from '../../../types';
import user from '@testing-library/user-event';
import AddPhotosDialog from './AddPhotosDialog';
import { getSingleCollection, addMorePhotos } from '../../../firebase';

jest.mock('../../../firebase');

const props: AddPhotosDialogProps = {
  collectionId: 'collectionId',
  setCollection: jest.fn(),
  setProgress: jest.fn(),
  addPhotosDialogOpen: true,
  setAddPhotosDialogOpen: jest.fn(),
  progress: 0,
};

describe('<NewCollection/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('adding no photos renders error', async () => {
    const { getByTestId, getByText, debug } = render(
      <AddPhotosDialog {...props} />
    );

    const addButton = getByText('Add');
    user.click(addButton);

    await waitFor(() => {
      expect(getByTestId('error')).toHaveTextContent('Images are required');
    });
  });

  test('adding photos calls firebase functions one time', async () => {
    const { baseElement, debug, getByText, findByText } = render(
      <AddPhotosDialog {...props} />
    );
    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.jpeg', { type: 'image/jpeg' }),
      new File([new ArrayBuffer(1)], 'file2.jpeg', { type: 'image/jpeg' }),
    ];

    const fileInput = baseElement.querySelector('input[type="file"]');

    user.upload(fileInput as HTMLInputElement, filesToUplaod);

    await findByText('file1.jpeg');
    await findByText('file2.jpeg');

    const addButton = getByText('Add');
    user.click(addButton);

    await waitFor(() => {
      expect(addMorePhotos).toHaveBeenCalledTimes(1);
      expect(getSingleCollection).toHaveBeenCalledTimes(1);
    });
  });
});
