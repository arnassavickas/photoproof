import React from 'react'
import user from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'

import { render, waitFor, screen } from '../../../utils/customTestRenderer'
import { CollectionDetailsProps } from '../../../types'
import CollectionDetails from './CollectionDetails'
import { collection } from '../../../utils/testUtils'
import { changeCollectionStatus, updateSettings } from '../../../firebase'

jest.mock('../../../firebase')

const props: CollectionDetailsProps = {
  setConfirmationDialogOpen: jest.fn(),
  setConfirmationDialogTitle: jest.fn(),
  setConfirmationDialogContentText: jest.fn(),
  setConfirmationDialogAgree: jest.fn(),
}

describe('<CollectionDetails/>', () => {
  let mockStore = {
    collections: { collectionsList: [collection], currentId: collection.id, reorderPending: false },
  }
  const writeText = jest.spyOn(navigator.clipboard, 'writeText')

  beforeEach(() => {
    mockStore = {
      collections: {
        collectionsList: [collection],
        currentId: collection.id,
        reorderPending: false,
      },
    }
  })

  describe('when collection stattus is selecting', () => {
    test('clicking "edit" button calls changeCollectionStatus one time', async () => {
      render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )

      const editButton = screen.getByText('Edit')
      user.click(editButton)
      await waitFor(() => {
        expect(changeCollectionStatus).toHaveBeenCalledTimes(1)
      })
    })

    test('clicking "copy selections" calls copySelections one time', async () => {
      render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )
      const copyButton = screen.getByText(/copy selections/i)
      user.click(copyButton)

      await waitFor(() => {
        expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when collection status is confirmed', () => {
    beforeEach(() => {
      mockStore.collections.collectionsList[0].status = 'confirmed'
    })

    test('clicking "edit" button calls setConfirmationDialogAgree one time', async () => {
      render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )

      const editButton = screen.getByText('Edit')
      user.click(editButton)

      await waitFor(() => {
        expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1)
      })
    })

    test('clicking "copy selections" calls navigator.clipboard.writeText one time', async () => {
      render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )

      const copyButton = screen.getByText(/copy selections/i)
      user.click(copyButton)

      await waitFor(() => {
        expect(writeText).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when collection stattus is editing', () => {
    beforeEach(() => {
      mockStore.collections.collectionsList[0].status = 'editing'
    })

    test('saving empty title renders error', async () => {
      const { baseElement } = render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )

      const title = screen.getByLabelText('Title')
      user.clear(title)

      const saveButton = screen.getByText('Save')
      user.click(saveButton)

      await waitFor(() => {
        expect(baseElement).toHaveTextContent('Title is required')
      })
    })

    test('entering valid data calls updateSettings one time with correct args', async () => {
      render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )

      const title = screen.getByLabelText('Title')
      user.clear(title)
      user.type(title, 'new title')

      const allowComments = screen.getByLabelText('Allow comments')
      user.click(allowComments)

      const minSelectRequired = screen.getByLabelText(/minimum/i)
      user.click(minSelectRequired)
      const maxSelectGoal = screen.getByTestId('maxSelectGoal')
      user.clear(maxSelectGoal)
      user.type(maxSelectGoal, '4')

      const saveButton = screen.getByText('Save')
      user.click(saveButton)

      await waitFor(() => {
        expect(updateSettings).toHaveBeenCalledTimes(1)
      })
      expect(updateSettings).toHaveBeenCalledWith(
        {
          title: 'new title',
          minSelect: {
            required: false,
            goal: 1,
          },
          maxSelect: {
            required: true,
            goal: 4,
          },
          allowComments: false,
        },
        'collectionId',
      )
    })

    test('clicking "copy selections" calls navigator.clipboard.writeText one time', async () => {
      render(
        <Router>
          <CollectionDetails {...props} />
        </Router>,
        { initialState: mockStore },
      )

      const copyButton = screen.getByText(/copy selections/i)
      user.click(copyButton)

      await waitFor(() => {
        expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1)
      })
    })
  })
})
