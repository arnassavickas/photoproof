import React from 'react';
import { render, screen } from '../../../utils/customTestRenderer';
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
  commentTextarea: 'test comment',
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

describe('<SelectionView/> lightbox open', () => {
  beforeAll(() => {
    props.lightboxOpen = true;
  });
  afterAll(() => {
    props.lightboxOpen = false;
  });
  test('select and comment buttons are visible', () => {
    render(<SelectionView {...props} />);

    const selectBtns = screen.getAllByRole('button', {
      hidden: true,
      name: 'selectLighbox',
    });

    const commentBtns = screen.getAllByRole('button', {
      hidden: true,
      name: 'commentLightbox',
    });

    expect(selectBtns).toHaveLength(1);
    expect(commentBtns).toHaveLength(1);
  });

  test(`select button click calls
  updatePhotoSelection with correct args`, () => {
    render(<SelectionView {...props} />);

    const selectBtn = screen.getByRole('button', {
      hidden: true,
      name: 'selectLighbox',
    });

    user.click(selectBtn);

    expect(updatePhotoSelection).toHaveBeenCalledWith(
      'collectionId',
      'photoId1',
      true
    );
  });

  test(`comment button click calls
  openCommentModal once`, async () => {
    render(<SelectionView {...props} />);

    const selectBtn = screen.getByRole('button', {
      hidden: true,
      name: 'commentLightbox',
    });

    user.click(selectBtn);

    expect(props.openCommentModal).toHaveBeenCalledTimes(1);
  });
});

describe('<SelectionView/> comment open', () => {
  beforeAll(() => {
    props.commentOpen = true;
  });
  afterAll(() => {
    props.commentOpen = false;
  });
  test(`saving comment calls savePhotoComment
   with correct args`, async () => {
    render(<SelectionView {...props} />);

    const saveBtn = await screen.findByText('Save');

    user.click(saveBtn);

    expect(updatePhotoComment).toHaveBeenCalledWith(
      'collectionId',
      'photoId1',
      'test comment'
    );
  });
});
