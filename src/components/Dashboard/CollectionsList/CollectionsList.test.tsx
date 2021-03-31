import React from 'react';

import { render, screen } from '../../../utils/customTestRenderer';
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
    //@ts-ignore
    getCollections.mockResolvedValueOnce(collectionList);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders two rows of collections', async () => {
    render(<CollectionList />);

    const titles = await screen.findAllByText(/collection title/);

    expect(titles).toHaveLength(2);
  });
  test('clicking a row calls history.push with correct collectionId', async () => {
    render(<CollectionList />);

    const title = await screen.findByText(/collection title 1/);
    user.click(title);

    expect(mockHistoryPush).toBeCalledWith('edit/collectionId1');
  });
  test('clicking delete button calls deleteCollection with correct collectionId', async () => {
    render(<CollectionList />);

    const deleteBtn = await screen.findAllByRole('button', {
      name: /delete/i,
    });
    user.click(deleteBtn[0]);
    const yesBtn = screen.getByText('Yes');
    user.click(yesBtn);

    expect(deleteCollection).toHaveBeenCalledWith(
      collectionList[0].id,
      expect.anything()
    );
  });
});
