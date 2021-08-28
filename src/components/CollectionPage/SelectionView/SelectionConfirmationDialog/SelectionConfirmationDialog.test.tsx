import React from 'react'
import user from '@testing-library/user-event'

import { render, screen, waitFor } from '../../../../utils/customTestRenderer'
import SelectionConfirmationDialog from './SelectionConfirmationDialog'
import { collection } from '../../../../utils/testUtils'
import { SelectionConfirmationDialogProps } from '../../../../types'
import { confirmCollection } from '../../../../firebase'

jest.mock('../../../../firebase')

const props: SelectionConfirmationDialogProps = {
  selectedPhotos: 1,
  confirmDialogOpen: true,
  setConfirmDialogOpen: jest.fn(),
}

describe('<SelectionConfirmationDialog/>', () => {
  let mockStore = { collection: { data: collection } }

  beforeEach(() => {
    mockStore = { collection: { data: collection } }
  })

  test('renders content', async () => {
    render(<SelectionConfirmationDialog {...props} />, { initialState: mockStore })

    expect(screen.getByText(/You have selected/)).toHaveTextContent('You have selected 1 photos')
    expect(
      screen.getByText('you will not be able to select more photos after confirming!'),
    ).toHaveTextContent('Warning: you will not be able to select more photos after confirming!')
  })

  test('allows to submit without final comment', async () => {
    render(<SelectionConfirmationDialog {...props} />, { initialState: mockStore })

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' })

    user.click(confirmBtn)

    await waitFor(() => {
      expect(confirmCollection).toHaveBeenCalledWith(
        mockStore.collection.data.id,
        mockStore.collection.data.title,
        expect.anything(),
        1,
        '',
      )
    })
  })

  test('submitting calls confirmCollection with comment included', async () => {
    render(<SelectionConfirmationDialog {...props} />, { initialState: mockStore })

    const textbox = screen.getByRole('textbox')
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' })

    user.type(textbox, 'some final comment')
    user.click(confirmBtn)

    await waitFor(() => {
      expect(confirmCollection).toHaveBeenCalledWith(
        mockStore.collection.data.id,
        mockStore.collection.data.title,
        expect.anything(),
        1,
        'some final comment',
      )
    })
  })
})
