import React from 'react'

import { render, screen } from '../../../utils/customTestRenderer'
import PhotoTable from './PhotoTable'
import { PhotoTableProps } from '../../../types'
import { collection, filteredPhotos } from '../../../utils/testUtils'

const setSelected = jest.fn()
const setPhotoIndex = jest.fn()
const setLightboxOpen = jest.fn()

const props: PhotoTableProps = {
  selected: [],
  setSelected,
  setPhotoIndex,
  setLightboxOpen,
}

describe('<PhotoTable/>', () => {
  let mockStore = { singleCollection: { collection, filteredPhotos, filter: 'all' } }

  beforeEach(() => {
    mockStore = { singleCollection: { collection, filteredPhotos, filter: 'all' } }
  })
  test('renders two rows', () => {
    render(<PhotoTable {...props} />, { initialState: mockStore })

    expect(screen.getAllByText(/photo/)).toHaveLength(2)
  })

  test('renders one comment', () => {
    render(<PhotoTable {...props} />, { initialState: mockStore })
    const commentCells = screen.getAllByTestId('comment')
    expect(commentCells).toHaveLength(2)
    expect(commentCells[0]).not.toHaveTextContent('test comment')
    expect(commentCells[1]).toHaveTextContent('test comment')
  })

  test('renders one selection icon', () => {
    render(<PhotoTable {...props} />, { initialState: mockStore })
    const selectedIcons = screen.getAllByTestId('selected')
    expect(selectedIcons).toHaveLength(1)
  })

  describe('when collecction status is editing', () => {
    beforeEach(() => {
      mockStore.singleCollection.collection.status = 'editing'
    })

    test('renders two checkboxes', () => {
      render(<PhotoTable {...props} />, { initialState: mockStore })
      const checkboxes = screen.getAllByTestId('checkbox')
      expect(checkboxes).toHaveLength(2)
    })
  })
})
