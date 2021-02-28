import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import CollectionPage from './CollectionPage';
import { collection } from '../../utils/testUtils';
import { getSingleCollection } from '../../firebase';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

jest.mock('../../firebase');
const mockedGetSingleCollection = getSingleCollection as any;

describe('<CollectionPage/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('getSingleCollection is called with correct id', async () => {
    mockedGetSingleCollection.mockResolvedValueOnce(collection);
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    });
    render(
      <Router history={history}>
        <Route path='/:id'>
          <CollectionPage />
        </Route>
      </Router>
    );

    expect(getSingleCollection).toHaveBeenCalledWith('collectionId');
  });
  test('correct details is rendered', async () => {
    mockedGetSingleCollection.mockResolvedValueOnce(collection);
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    });
    const { findByText } = render(
      <Router history={history}>
        <Route path='/:id'>
          <CollectionPage />
        </Route>
      </Router>
    );

    await findByText('collection title');
    await findByText(/selected: 1/i);
    await findByText(/you must select from 1 to 2 photos/i);
  });

  test('changing filter where no photos exist, shows text', async () => {
    collection.photos[1].selected = false;
    mockedGetSingleCollection.mockResolvedValueOnce(collection);
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    });
    const { findByText, getByText } = render(
      <Router history={history}>
        <Route path='/:id'>
          <CollectionPage />
        </Route>
      </Router>
    );

    await findByText(/selected: 0/i);

    const selectedBtn = getByText(/^selected$/i);
    user.click(selectedBtn);

    await findByText(/no photos in this filter/i);
  });
  test('collection without photos shows text', async () => {
    collection.photos = [];
    mockedGetSingleCollection.mockResolvedValueOnce(collection);
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    });
    const { findByText } = render(
      <Router history={history}>
        <Route path='/:id'>
          <CollectionPage />
        </Route>
      </Router>
    );

    await findByText(/no photos in collection/i);
  });
});
