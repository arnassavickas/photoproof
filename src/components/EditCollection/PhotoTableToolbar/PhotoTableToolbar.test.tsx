import React from 'react';

import { getByLabelText, render, within } from '@testing-library/react';
import { PhotoTableToolbarProps } from '../../../types';
import user from '@testing-library/user-event';
import PhotoTableToolbar from './PhotoTableToolbar';
import { collection, filteredPhotos } from '../../../utils/testUtils';
import { deletePhotos, resetPhotos } from '../../../firebase';

jest.mock('../../../firebase');

const props: PhotoTableToolbarProps = {
  collectionId: 'collectionId',
  collection,
  setCollection: jest.fn(),
  filteredPhotos,
  setFilteredPhotos: jest.fn(),
  setConfirmationDialogOpen: jest.fn(),
  setConfirmationDialogTitle: jest.fn(),
  setConfirmationDialogContentText: jest.fn(),
  setConfirmationDialogAgree: jest.fn(),
  setProgress: jest.fn(),
  selected: [],
  setSelected: jest.fn(),
  setAddPhotosDialogOpen: jest.fn(),
};

describe('<PhotoTableToolbar/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('changing filter calls setFilteredPhotos', async () => {
    const { getByLabelText, debug, getByRole } = render(
      <PhotoTableToolbar {...props} />
    );

    const filter = getByLabelText('Filter');
    user.click(filter);
    const listbox = within(getByRole('listbox'));
    const selected = listbox.getByText('Selected');
    user.click(selected);

    expect(props.setFilteredPhotos).toHaveBeenCalled();
  });
});

describe('<PhotoTableToolbar/> editing', () => {
  props.collection.status = 'editing';
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('clicking "add photos" calls setAddPhotosDialogOpen', async () => {
    const { getByText, debug, getByRole } = render(
      <PhotoTableToolbar {...props} />
    );

    const addPhotos = getByText(/add photos/i);
    user.click(addPhotos);

    expect(props.setAddPhotosDialogOpen).toHaveBeenCalledTimes(1);
  });

  test('clicking "reset selections and comments" calls setConfirmationDialogAgree one time', async () => {
    const { getByText, debug, findByText } = render(
      <PhotoTableToolbar {...props} />
    );

    const resetButton = getByText(/reset selections and comments/i);
    debug(resetButton);
    user.click(resetButton);
    expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1);
  });

  test('clicking checkbox and delete calls setConfirmationDialogAgree one time', () => {
    props.selected = ['photoId1', 'photoId2'];
    const { getByText, debug, getByLabelText } = render(
      <PhotoTableToolbar {...props} />
    );

    getByText('2 to be deleted');
    const deleteButton = getByLabelText('delete');
    user.click(deleteButton);

    expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1);
  });
});
