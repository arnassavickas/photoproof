import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import SelectionView from './SelectionView';
import { collection, filteredPhotos } from '../../../utils/testUtils';
import { SelectionViewProps } from '../../../types';
import { updatePhotoSelection, updatePhotoComment } from '../../../firebase';

jest.mock('../../../firebase');

const props: SelectionViewProps = {
  collection,
  setCollection: jest.fn(),
  collectionId: collection.id,
  filteredPhotos,
  lightboxOpen: false,
  setLightboxOpen: jest.fn(),
  openLightbox: jest.fn(),
  openCommentModal: jest.fn(),
  photoIndex: 0,
  setPhotoIndex: jest.fn(),
  commentOpen: true,
  setCommentOpen: jest.fn(),
  commentTextarea: '',
  setCommentTextarea: jest.fn(),
  selectedPhotos: 1,
};

describe('<SelectionView/>', () => {
  test(`confirm button calls confimation dialog
  if allowed`, async () => {
    render(<SelectionView {...props} />);

    const confirmBtn = screen.getByText(/confirm 1 selections/);

    user.click(confirmBtn);

    await screen.findByText('Confirm selections');
  });

  test(`confirm button calls confimation forbidden dialog
  if selections are out of requirements`, async () => {
    props.selectedPhotos = 0;
    const { rerender } = render(<SelectionView {...props} />);

    const confirmBtn = screen.getByText(/confirm 0 selections/);

    user.click(confirmBtn);

    await screen.findByText('Please adjust your selections!');

    props.selectedPhotos = 3;

    rerender(<SelectionView {...props} />);

    await screen.findByText('Please adjust your selections!');
  });
});
