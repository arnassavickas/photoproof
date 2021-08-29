import React from 'react'

import user from '@testing-library/user-event'

import { render, screen } from '../../../utils/customTestRenderer'
import { PhotoTableToolbarProps } from '../../../types'
import PhotoTableToolbar from './PhotoTableToolbar'
import { collection } from '../../../utils/testUtils'

jest.mock('../../../firebase')

const props: PhotoTableToolbarProps = {
  collectionId: 'collectionId',
  setConfirmationDialogOpen: jest.fn(),
  setConfirmationDialogTitle: jest.fn(),
  setConfirmationDialogContentText: jest.fn(),
  setConfirmationDialogAgree: jest.fn(),
  setProgress: jest.fn(),
  selected: [],
  setSelected: jest.fn(),
  setAddPhotosDialogOpen: jest.fn(),
}

describe('<PhotoTableToolbar/>', () => {
  let mockStore = { singleCollection: { collection } }

  beforeEach(() => {
    mockStore = { singleCollection: { collection } }
  })

  describe('when collection is with editing status', () => {
    beforeEach(() => {
      mockStore.singleCollection.collection.status = 'editing'
    })

    test('clicking "add photos" calls setAddPhotosDialogOpen', async () => {
      render(<PhotoTableToolbar {...props} />, { initialState: mockStore })

      user.click(screen.getByText(/add photos/i))

      expect(props.setAddPhotosDialogOpen).toHaveBeenCalledTimes(1)
    })

    test('clicking "reset selections and comments" calls setConfirmationDialogAgree one time', async () => {
      render(<PhotoTableToolbar {...props} />, { initialState: mockStore })

      user.click(screen.getByText(/reset selections and comments/i))

      expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1)
    })

    test('clicking checkbox and delete calls setConfirmationDialogAgree one time', () => {
      props.selected = ['photoId1', 'photoId2']
      render(<PhotoTableToolbar {...props} />, { initialState: mockStore })

      expect(screen.getByText('2 to be deleted')).toBeInTheDocument()

      user.click(screen.getByLabelText('delete'))

      expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1)
    })
  })
})
