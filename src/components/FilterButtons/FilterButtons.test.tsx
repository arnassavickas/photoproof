import React from 'react'

import user from '@testing-library/user-event'

import { render, screen } from '../../utils/customTestRenderer'
import FilterButtons from './FilterButtons'
import { collection, filteredPhotos } from '../../utils/testUtils'
import * as collectionSlice from '../../reducers/collectionsSlice'

const setPhotoFilter = jest.spyOn(collectionSlice, 'setPhotoFilter')

describe('<FilterButtons/>', () => {
  let mockStore = {
    collections: { collectionsList: [collection], currentId: collection.id, filteredPhotos },
  }

  beforeEach(() => {
    setPhotoFilter.mockReturnValue({ type: '', payload: 'selected' })

    mockStore = {
      collections: { collectionsList: [collection], currentId: collection.id, filteredPhotos },
    }
  })

  test('button clicks call action creator with correct args', async () => {
    render(<FilterButtons />, { initialState: mockStore })

    user.click(screen.getByRole('button', { name: /^selected/i }))

    expect(setPhotoFilter).toHaveBeenLastCalledWith('selected')

    user.click(screen.getByRole('button', { name: /^all/i }))

    expect(setPhotoFilter).toHaveBeenLastCalledWith('all')

    user.click(
      screen.getByRole('button', {
        name: /^not selected/i,
      }),
    )

    expect(setPhotoFilter).toHaveBeenLastCalledWith('unselected')
  })
})
