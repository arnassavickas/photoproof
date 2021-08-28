import React from 'react'
import user from '@testing-library/user-event'
import { Route, Router } from 'react-router-dom'
import { noop } from 'lodash'

import { createMemoryHistory } from 'history'

import { render, screen } from '../../utils/customTestRenderer'
import CollectionPage from './CollectionPage'
import { collection } from '../../utils/testUtils'
import { getSingleCollection } from '../../firebase'

jest.mock('../../firebase')
const mockedGetSingleCollection = getSingleCollection as any

describe('<CollectionPage/>', () => {
  beforeEach(() => {
    // jest.spyOn(console, 'error').mockImplementation(noop)
  })

  test('getSingleCollection is called with correct id', async () => {
    mockedGetSingleCollection.mockResolvedValueOnce(collection)
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
    )

    expect(getSingleCollection).toHaveBeenCalledWith('collectionId')
  })
  test('correct details is rendered', async () => {
    mockedGetSingleCollection.mockResolvedValueOnce(collection)
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    const { rerender } = render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
    )

    expect(await screen.findByText('collection title')).toBeInTheDocument()
    expect(await screen.findByText(/^selected 1/i)).toBeInTheDocument()
    expect(await screen.findByText(/you must select from 1 to 2 photos/i)).toBeInTheDocument()

    collection.minSelect.required = false

    rerender(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
    )

    expect(await screen.findByText(/you must select a maximum of 2 photos/i)).toBeInTheDocument()

    collection.minSelect.required = true
    collection.maxSelect.required = false

    rerender(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
    )

    expect(await screen.findByText(/you must select at least 1 photos/i)).toBeInTheDocument()
  })

  test('changing filter where no photos exist, shows text', async () => {
    collection.photos[1].selected = false
    mockedGetSingleCollection.mockResolvedValueOnce(collection)
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
    )

    expect(await screen.findByText(/^selected 0/i)).toBeInTheDocument()

    const selectedBtn = screen.getByText(/^selected/i)
    user.click(selectedBtn)

    expect(await screen.findByText(/no photos in this filter/i)).toBeInTheDocument()
  })

  test('collection without photos shows text', async () => {
    collection.photos = []
    mockedGetSingleCollection.mockResolvedValueOnce(collection)
    const history = createMemoryHistory({
      initialEntries: ['/collectionId'],
    })
    render(
      <Router history={history}>
        <Route path="/:id">
          <CollectionPage />
        </Route>
      </Router>,
    )

    expect(await screen.findByText(/no photos in collection/i)).toBeInTheDocument()
  })
})
