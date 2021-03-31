import React from 'react';

import { render, waitFor, screen } from '../../../utils/customTestRenderer';
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

describe('<AddPhotosDialog/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('adding no photos renders error', async () => {
    render(
      <AddPhotosDialog {...props} />
    );

    const addButton = screen.getByText('Add');
    user.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Images are required'
      );
    });
  });

  test('adding photos calls firebase functions one time', async () => {
    const { baseElement } = render(
      <AddPhotosDialog {...props} />
    );
    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.jpeg', { type: 'image/jpeg' }),
      new File([new ArrayBuffer(1)], 'file2.jpeg', { type: 'image/jpeg' }),
    ];

    const fileInput = baseElement.querySelector('input[type="file"]');

    user.upload(fileInput as HTMLInputElement, filesToUplaod);

    await screen.findByText('file1.jpeg');
    await screen.findByText('file2.jpeg');

    const addButton = screen.getByText('Add');
    user.click(addButton);

    await waitFor(() => {
      expect(addMorePhotos).toHaveBeenCalledTimes(1);
      expect(getSingleCollection).toHaveBeenCalledTimes(1);
    });
  });
});
