import React from 'react';

import { render} from '@testing-library/react';
import user from '@testing-library/user-event';
import PhotoGrid from './PhotoGrid';
import { Collection, PhotoGridProps } from '../../../types';
import { updatePhotoSelection as mockUpdatePhotoSelection } from '../../../firebase';

const openCommentModal = jest.fn();
const setCollection = jest.fn();
const openLightbox = jest.fn();

const props: PhotoGridProps = {
  collectionId: 'collectionId',
  collection: {
    id: 'collectionId',
    dateCreated: new Date(),
    title: 'collectio title',
    minSelect: { required: true, goal: 1 },
    maxSelect: { required: true, goal: 2 },
    allowComments: true,
    status: 'selecting',
    finalComment: '',
    photos: [
      {
        index: 1,
        id: 'photoId1',
        filename: 'photo1.jpg',
        filenameNumber: 1,
        cloudUrl: 'www.cloudurl.lt1',
        cloudUrlWebp: 'www.cloudurl.lt/webp1',
        thumbnail: 'www.cloudurl.lt/thumbnail1',
        thumbnailWebp: 'www.cloudurl.lt/thumbnail/webp1',
        selected: false,
        comment: '',
        dateTaken: new Date(),
      },
      {
        index: 2,
        id: 'photoId2',
        filename: 'photo2.jpg',
        filenameNumber: 2,
        cloudUrl: 'www.cloudurl.lt2',
        cloudUrlWebp: 'www.cloudurl.lt/webp2',
        thumbnail: 'www.cloudurl.lt/thumbnail2',
        thumbnailWebp: 'www.cloudurl.lt/thumbnail/webp2',
        selected: true,
        comment: 'test',
        dateTaken: new Date(),
      },
    ],
  },
  setCollection,
  filteredPhotos: [
    {
      index: 1,
      id: 'photoId1',
      filename: 'photo1.jpg',
      filenameNumber: 1,
      cloudUrl: 'www.cloudurl.lt1',
      cloudUrlWebp: 'www.cloudurl.lt/webp1',
      thumbnail: 'www.cloudurl.lt/thumbnail1',
      thumbnailWebp: 'www.cloudurl.lt/thumbnail/webp1',
      selected: false,
      comment: '',
      dateTaken: new Date(),
    },
    {
      index: 2,
      id: 'photoId2',
      filename: 'photo2.jpg',
      filenameNumber: 2,
      cloudUrl: 'www.cloudurl.lt2',
      cloudUrlWebp: 'www.cloudurl.lt/webp2',
      thumbnail: 'www.cloudurl.lt/thumbnail2',
      thumbnailWebp: 'www.cloudurl.lt/thumbnail/webp2',
      selected: true,
      comment: 'test',
      dateTaken: new Date(),
    },
  ],
  openLightbox,
  openCommentModal,
};

jest.mock('../../../firebase');

describe('<PhotoGrid/> collection.status="selecting"', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders one photo', async () => {
    const { getAllByAltText} = render(<PhotoGrid {...props} />);
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
    const { getAllByRole} = render(<PhotoGrid {...props} />);

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

const editingCollection = {
  ...props.collection,
  status: 'confirmed' as Collection['status'],
};
const editingProps = { ...props, collection: editingCollection };
console.log(editingProps.collection.photos[0].comment.length);
console.log(editingProps.collection.photos[1].comment.length);
console.log(editingProps.filteredPhotos[0].comment.length);
console.log(editingProps.filteredPhotos[1].comment.length);
console.log(editingProps);

describe('<PhotoGrid/> collection.status="confirmed"', () => {
  test('renders only one comment button', () => {
    const { getAllByRole} = render(
      <PhotoGrid {...editingProps} />
    );

    const commentBtn = getAllByRole('button', {
      name: /comment/i,
    });
    expect(commentBtn).toHaveLength(1);
  });
});
