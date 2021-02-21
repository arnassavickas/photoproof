import React from 'react';

import { render, prettyDOM } from '@testing-library/react';
import user from '@testing-library/user-event';
import PhotoTable from './PhotoTable';
import { Collection, PhotoTableProps } from '../../../types';
import { updatePhotoSelection as mockUpdatePhotoSelection } from '../../../firebase';

const setSelected = jest.fn();
const setPhotoIndex = jest.fn();
const setLightboxOpen = jest.fn();

const props: PhotoTableProps = {
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
        filename: 'photo1',
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
        filename: 'photo2',
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
  filteredPhotos: [
    {
      index: 1,
      id: 'photoId1',
      filename: 'photo1',
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
      filename: 'photo2',
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
  selected: [],
  setSelected,
  setPhotoIndex,
  setLightboxOpen,
};

describe('<PhotoTable/>', () => {
  test('renders two rows plus head', () => {
    const { container } = render(<PhotoTable {...props} />);
    const rows = container.querySelectorAll('tr');
    expect(rows).toHaveLength(3);
  });

  test('renders one comment', () => {
    const { container, getAllByTestId, debug } = render(
      <PhotoTable {...props} />
    );
    const rows = container.querySelectorAll('tr');
    //console.log(prettyDOM(rows[2]));
    const commentCells = getAllByTestId('comment');
    expect(commentCells).toHaveLength(2);
    expect(commentCells[0]).not.toHaveTextContent('test');
    expect(commentCells[1]).toHaveTextContent('test');
  });

  test('renders one selection icon', () => {
    const { container, getAllByTestId, debug } = render(
      <PhotoTable {...props} />
    );
    const selectedIcons = getAllByTestId('selected');
    expect(selectedIcons).toHaveLength(1);
  });
});

describe('<PhotoTable/> status="editing"', () => {
  props.collection.status = 'editing';
  test('renders three checkboxes', () => {
    const { getAllByTestId } = render(<PhotoTable {...props} />);
    const checkboxes = getAllByTestId('checkbox');
    expect(checkboxes).toHaveLength(3);
  });
});
