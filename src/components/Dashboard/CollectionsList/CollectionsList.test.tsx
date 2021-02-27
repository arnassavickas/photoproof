import React from 'react';

import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import CollectionList from './CollectionsList';
import { collectionList } from '../../../utils/testUtils';
import { getCollections, deleteCollection } from '../../../firebase';

jest.mock('../../../firebase');
const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('<CollectionList/>', () => {
  beforeEach(() => {
    getCollections.mockResolvedValueOnce(collectionList);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders two rows of collections', async () => {
    const { findAllByText } = render(<CollectionList />);

    const titles = await findAllByText(/collection title/);

    expect(titles).toHaveLength(2);
  });
  test('clicking a row calls history.push with correct collectionId', async () => {
    const { findByText } = render(<CollectionList />);

    const title = await findByText(/collection title 1/);
    user.click(title);

    expect(mockHistoryPush).toBeCalledWith('edit/collectionId1');
  });
  test('clicking delete button calls deleteCollection with correct collectionId', async () => {
    const { findAllByRole, getByText } = render(<CollectionList />);

    const deleteBtn = await findAllByRole('button', {
      name: /delete/i,
    });
    user.click(deleteBtn[0]);
    const yesBtn = getByText('Yes');
    user.click(yesBtn);

    expect(deleteCollection).toHaveBeenCalledWith(
      collectionList[0].id,
      expect.anything()
    );
  });
});
