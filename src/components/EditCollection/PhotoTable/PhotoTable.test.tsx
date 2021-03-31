import React from 'react';

import { render, screen } from '../../../utils/customTestRenderer';
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
    render(
      <PhotoTable {...props} />
    );
    const commentCells = screen.getAllByTestId('comment');
    expect(commentCells).toHaveLength(2);
    expect(commentCells[0]).not.toHaveTextContent('test comment');
    expect(commentCells[1]).toHaveTextContent('test comment');
  });

  test('renders one selection icon', () => {
    render(
      <PhotoTable {...props} />
    );
    const selectedIcons = screen.getAllByTestId('selected');
    expect(selectedIcons).toHaveLength(1);
  });
});

describe('<PhotoTable/> status="editing"', () => {
  props.collection.status = 'editing';
  test('renders two checkboxes', () => {
    render(<PhotoTable {...props} />);
    const checkboxes = screen.getAllByTestId('checkbox');
    expect(checkboxes).toHaveLength(2);
  });
});
