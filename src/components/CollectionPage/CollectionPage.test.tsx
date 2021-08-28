import React from 'react'
import { Route, Router } from 'react-router-dom'

import { createMemoryHistory } from 'history'

import { render, screen } from '../../utils/customTestRenderer'
import CollectionPage from './CollectionPage'
import { collection, filteredPhotos } from '../../utils/testUtils'
import * as firebase from '../../firebase'

jest.mock('../../firebase')
const getSingleCollection = jest.spyOn(firebase, 'getSingleCollection')

describe('<CollectionPage/>', () => {
  let mockStore = { collection: { data: collection, filteredPhotos } }

  beforeEach(() => {
    getSingleCollection.mockResolvedValue(collection)

    mockStore = { collection: { data: collection, filteredPhotos } }
  })

  test('getSingleCollection is called with correct id', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
      { initialState: mockStore },
    )

    expect(getSingleCollection).toHaveBeenCalledWith('collectionId')
  })

  test('correct details are rendered (min: yes, max: yes)', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
      { initialState: mockStore },
    )

    expect(await screen.findByText('collection title')).toBeInTheDocument()
    expect(await screen.findByText(/^selected 1/i)).toBeInTheDocument()
    expect(await screen.findByText(/you must select from 1 to 2 photos/i)).toBeInTheDocument()
  })

  test('correct details are rendered (min: no, max: yes)', async () => {
    mockStore = {
      ...mockStore,
      collection: {
        filteredPhotos,
        data: { ...collection, minSelect: { required: false, goal: 0 } },
      },
    }

    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
      { initialState: mockStore },
    )

    expect(await screen.findByText(/you must select a maximum of 2 photos/i)).toBeInTheDocument()
  })

  test('correct details are rendered (min: yes, max: no)', async () => {
    mockStore = {
      ...mockStore,
      collection: {
        filteredPhotos,
        data: {
          ...collection,
          minSelect: { required: true, goal: 1 },
          maxSelect: { required: false, goal: 0 },
        },
      },
    }

    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
      { initialState: mockStore },
    )

    expect(await screen.findByText(/you must select at least 1 photos/i)).toBeInTheDocument()
  })
})
