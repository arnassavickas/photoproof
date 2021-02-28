import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import LockedView from './LockedView';
import { collection, filteredPhotos } from '../../../utils/testUtils';
import { LockedViewProps } from '../../../types';

jest.mock('../../../firebase');

const props: LockedViewProps = {
  collection,
  filteredPhotos,
  lightboxOpen: true,
  setLightboxOpen: jest.fn(),
  openLightbox: jest.fn(),
  openCommentModal: jest.fn(),
  photoIndex: 0,
  setPhotoIndex: jest.fn(),
  commentOpen: false,
  setCommentOpen: jest.fn(),
  commentTextarea: '',
};

describe('<LockedView/>', () => {
  test(`select and comment buttons are visible`, async () => {
    render(<LockedView {...props} />);

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

  test(`clicking commentBtn in Lightbox calls openCommentModal once`, () => {
    render(<LockedView {...props} />);

    const commentBtn = screen.getByRole('button', {
      hidden: true,
      name: 'commentLightbox',
    });
    user.click(commentBtn);

    expect(props.openCommentModal).toHaveBeenCalledTimes(1);
  });
});
