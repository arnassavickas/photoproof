import React from 'react';

import {
  getByLabelText,
  getByText,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { CollectionDetailsProps } from '../../../types';
import user from '@testing-library/user-event';
import CollectionList from './CollectionsList';
import { collectionList } from '../../../utils/testUtils';
import { getCollections, deleteCollection } from '../../../firebase';

jest.mock('../../../firebase');

describe('<CollectionList/>', () => {
  beforeEach(() => {
    getCollections.mockResolvedValueOnce(collectionList);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders two rows of collections', async () => {
    const { getByText, debug, findAllByText } = render(<CollectionList />);

    const titles = await findAllByText(/collection title/);

    expect(titles).toHaveLength(2);
  });
});
