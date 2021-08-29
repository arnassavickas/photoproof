import React from 'react'
import userEvent from '@testing-library/user-event'
import { noop } from 'lodash'

import { render, screen } from '../../../utils/customTestRenderer'
import PhotoGrid from './PhotoGrid'
import { PhotoGridProps } from '../../../types'
import * as firebase from '../../../firebase'
import { collection, filteredPhotos } from '../../../utils/testUtils'

const openCommentModal = jest.fn()
const openLightbox = jest.fn()

const props: PhotoGridProps = {
  openLightbox,
  openCommentModal,
}

const updatePhotoSelection = jest.spyOn(firebase, 'updatePhotoSelection')

describe('<PhotoGrid />', () => {
  let mockStore = { collections: { collection, filteredPhotos } }

  beforeEach(() => {
    mockStore = { collections: { collection, filteredPhotos } }

    updatePhotoSelection.mockReturnValue(new Promise(noop))
  })

  describe('when collection status is selecting', () => {
    beforeEach(() => {
      mockStore.collections.collection.status = 'selecting'
    })

    test('renders one photo', async () => {
      render(<PhotoGrid {...props} />, { initialState: mockStore })

      const photos = screen.getAllByAltText(mockStore.collections.collection.title)

      expect(photos).toHaveLength(2)
    })

    test('photo click calls one time', () => {
      render(<PhotoGrid {...props} />, { initialState: mockStore })

      const photos = screen.getAllByAltText(mockStore.collections.collection.title)
      userEvent.click(photos[0])

      expect(openLightbox.mock.calls).toHaveLength(1)
    })

    test('comment button click calls one time', () => {
      render(<PhotoGrid {...props} />, { initialState: mockStore })

      const commentBtn = screen.getAllByRole('button', {
        name: /comment/i,
      })
      userEvent.click(commentBtn[0])

      expect(openCommentModal).toHaveBeenCalledTimes(1)
    })

    test('select button click calls api with correct args', async () => {
      render(<PhotoGrid {...props} />, { initialState: mockStore })

      const selectBtns = screen.getAllByTestId('select-btn')

      userEvent.click(selectBtns[0])

      expect(updatePhotoSelection).toHaveBeenCalledTimes(1)
      expect(updatePhotoSelection).toHaveBeenCalledWith(
        mockStore.collections.collection.id,
        filteredPhotos[0].id,
        !filteredPhotos[0].selected,
      )
    })
  })

  describe('when collection status is confirmed', () => {
    beforeEach(() => {
      mockStore.collections.collection.status = 'confirmed'
    })

    test('renders only one comment button', () => {
      render(<PhotoGrid {...props} />, { initialState: mockStore })

      const commentBtn = screen.getAllByRole('button', {
        name: /comment/i,
      })
      expect(commentBtn).toHaveLength(1)
    })
  })
})
