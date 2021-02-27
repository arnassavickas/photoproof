import React from 'react';

import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import PhotoGrid from './PhotoGrid';
import { Collection, PhotoGridProps } from '../../../types';
import { updatePhotoSelection as mockUpdatePhotoSelection } from '../../../firebase';
import { collection, filteredPhotos } from '../../../utils/testUtils';

const openCommentModal = jest.fn();
const setCollection = jest.fn();
const openLightbox = jest.fn();

const props: PhotoGridProps = {
  collectionId: 'collectionId',
  collection,
  setCollection,
  filteredPhotos,
  openLightbox,
  openCommentModal,
};

jest.mock('../../../firebase');

describe('<PhotoGrid/> collection.status="selecting"', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders one photo', async () => {
    const { getAllByAltText } = render(<PhotoGrid {...props} />);
    const photos = getAllByAltText(props.collection.title);
    expect(photos).toHaveLength(2);
  });

  test('photo click calls one time', () => {
    const { getAllByAltText } = render(<PhotoGrid {...props} />);
    const photos = getAllByAltText(props.collection.title);
    user.click(photos[0]);
    expect(openLightbox.mock.calls).toHaveLength(1);
  });

  test('comment button click calls one time', () => {
    const { getAllByRole } = render(<PhotoGrid {...props} />);
    const commentBtn = getAllByRole('button', {
      name: /comment/i,
    });
    user.click(commentBtn[0]);
    expect(openCommentModal.mock.calls).toHaveLength(1);
  });

  test('select button click updates collection and calls database one time', () => {
    const { getAllByRole } = render(<PhotoGrid {...props} />);

    let selectBtn = getAllByRole('button', {
      name: /select/i,
    });

    user.click(selectBtn[0]);

    expect(mockUpdatePhotoSelection).toHaveBeenCalledTimes(1);
    expect(props.collection.photos[0].selected).toBe(true);
    expect(props.collection.photos[1].selected).toBe(true);

    user.click(selectBtn[0]);

    expect(mockUpdatePhotoSelection).toHaveBeenCalledTimes(2);
    expect(props.collection.photos[0].selected).toBe(false);
    expect(props.collection.photos[1].selected).toBe(true);
  });

  test('updating photo.selected to true, renders a different icon path', () => {
    const { getAllByRole, rerender } = render(<PhotoGrid {...props} />);

    let selectBtn = getAllByRole('button', {
      name: /select/i,
    });

    expect(selectBtn[0].querySelector('path')?.getAttribute('d')).not.toEqual(
      selectBtn[1].querySelector('path')?.getAttribute('d')
    );
    props.filteredPhotos[0].selected = true;

    rerender(<PhotoGrid {...props} />);
    selectBtn = getAllByRole('button', {
      name: /select/i,
    });

    expect(selectBtn[0].querySelector('path')?.getAttribute('d')).toEqual(
      selectBtn[1].querySelector('path')?.getAttribute('d')
    );
  });

  test('updating photo.comment to some length, renders a different icon path', () => {
    const { getAllByRole, rerender } = render(<PhotoGrid {...props} />);

    let commentBtn = getAllByRole('button', {
      name: /comment/i,
    });

    expect(commentBtn[0].querySelector('path')?.getAttribute('d')).not.toEqual(
      commentBtn[1].querySelector('path')?.getAttribute('d')
    );
    props.filteredPhotos[0].comment = 'test';

    rerender(<PhotoGrid {...props} />);
    commentBtn = getAllByRole('button', {
      name: /select/i,
    });

    expect(commentBtn[0].querySelector('path')?.getAttribute('d')).toEqual(
      commentBtn[1].querySelector('path')?.getAttribute('d')
    );
    props.filteredPhotos[0].comment = '';
  });
});

describe('<PhotoGrid/> collection.status="confirmed"', () => {
  const editingCollection = {
    ...props.collection,
    status: 'confirmed' as Collection['status'],
  };
  const editingProps = { ...props, collection: editingCollection };

  test('renders only one comment button', () => {
    const { getAllByRole } = render(<PhotoGrid {...editingProps} />);

    const commentBtn = getAllByRole('button', {
      name: /comment/i,
    });
    expect(commentBtn).toHaveLength(1);
  });
});