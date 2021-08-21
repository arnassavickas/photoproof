import React from 'react'
import user from '@testing-library/user-event'

import { render, screen, waitFor } from '../../../../utils/customTestRenderer'
import SelectionConfirmationDialog from './SelectionConfirmationDialog'
import { collection } from '../../../../utils/testUtils'
import { SelectionConfirmationDialogProps } from '../../../../types'
import { confirmCollection } from '../../../../firebase'

jest.mock('../../../../firebase')

const props: SelectionConfirmationDialogProps = {
  collection,
  setCollection: jest.fn(),
  collectionId: collection.id,
  selectedPhotos: 1,
  confirmDialogOpen: true,
  setConfirmDialogOpen: jest.fn(),
}

describe('<SelectionConfirmationDialog/>', () => {
  test('renders content', async () => {
    render(<SelectionConfirmationDialog {...props} />)

    expect(screen.getByText(/You have selected/)).toHaveTextContent('You have selected 1 photos')
    expect(
      screen.getByText('you will not be able to select more photos after confirming!'),
    ).toHaveTextContent('Warning: you will not be able to select more photos after confirming!')
  })

  test('allows to submit without final comment', async () => {
    render(<SelectionConfirmationDialog {...props} />)

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' })

    user.click(confirmBtn)

    await waitFor(() => {
      expect(confirmCollection).toHaveBeenCalledWith(
        props.collectionId,
        props.collection.title,
        expect.anything(),
        1,
        '',
      )
    })
  })

  test('submitting calls confirmCollection with comment included', async () => {
    render(<SelectionConfirmationDialog {...props} />)

    const textbox = screen.getByRole('textbox')
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' })

    user.type(textbox, 'some final comment')
    user.click(confirmBtn)

    await waitFor(() => {
      expect(confirmCollection).toHaveBeenCalledWith(
        props.collectionId,
        props.collection.title,
        expect.anything(),
        1,
        'some final comment',
      )
    })
  })
})
