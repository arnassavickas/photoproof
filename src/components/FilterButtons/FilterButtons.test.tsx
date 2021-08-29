import React from 'react'

import user from '@testing-library/user-event'

import { render, screen } from '../../utils/customTestRenderer'
import { FilterButtonsProps } from '../../types'
import FilterButtons from './FilterButtons'
import { collection, filteredPhotos } from '../../utils/testUtils'
import * as collectionSlice from '../../reducers/collectionsSlice'

const props: FilterButtonsProps = {
  modifyLightbox: true,
  setLightboxOpen: jest.fn(),
  photoIndex: 1,
  setPhotoIndex: jest.fn(),
}

const setPhotoFilter = jest.spyOn(collectionSlice, 'setPhotoFilter')

describe('<FilterButtons/>', () => {
  let mockStore = { collections: { collection, filteredPhotos } }

  beforeEach(() => {
    setPhotoFilter.mockReturnValue({ type: '', payload: 'selected' })

    mockStore = { collections: { collection, filteredPhotos } }
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

  describe('when props are provided', () => {
    test('calls photo index callback if filtered photos quantity is less than photo index', () => {
      mockStore.collections.filteredPhotos = [filteredPhotos[0]]
      render(<FilterButtons {...props} />, { initialState: mockStore })

      const selectedBtn = screen.getByRole('button', { name: /^selected/i })

      user.click(selectedBtn)

      expect(props.setPhotoIndex).toHaveBeenCalledWith(0)
    })
    test('calls lightbox callback if filtered photos are empty', () => {
      mockStore.collections.filteredPhotos = []
      render(<FilterButtons {...props} />, { initialState: mockStore })

      const selectedBtn = screen.getByRole('button', { name: /^selected/i })

      user.click(selectedBtn)

      expect(props.setLightboxOpen).toHaveBeenCalledWith(false)
    })
  })
})
