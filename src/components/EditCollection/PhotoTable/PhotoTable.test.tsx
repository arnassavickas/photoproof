import React from 'react';

import { render } from '@testing-library/react';
import PhotoTable from './PhotoTable';
import { PhotoTableProps } from '../../../types';
import { collection, filteredPhotos } from '../../../utils/testUtils';

const setSelected = jest.fn();
const setPhotoIndex = jest.fn();
const setLightboxOpen = jest.fn();

const props: PhotoTableProps = {
  collection,
  filteredPhotos,
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
    const { getAllByTestId } = render(
      <PhotoTable {...props} />
    );
    const commentCells = getAllByTestId('comment');
    expect(commentCells).toHaveLength(2);
    expect(commentCells[0]).not.toHaveTextContent('test comment');
    expect(commentCells[1]).toHaveTextContent('test comment');
  });

  test('renders one selection icon', () => {
    const { getAllByTestId } = render(
      <PhotoTable {...props} />
    );
    const selectedIcons = getAllByTestId('selected');
    expect(selectedIcons).toHaveLength(1);
  });
});

describe('<PhotoTable/> status="editing"', () => {
  props.collection.status = 'editing';
  test('renders two checkboxes', () => {
    const { getAllByTestId } = render(<PhotoTable {...props} />);
    const checkboxes = getAllByTestId('checkbox');
    expect(checkboxes).toHaveLength(2);
  });
});
