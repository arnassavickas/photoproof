import React from 'react'
import user from '@testing-library/user-event'

import { render, screen } from '../../../../utils/customTestRenderer'
import ConfirmationForbiddenDialog from './ConfirmationForbiddenDialog'
import { collection } from '../../../../utils/testUtils'
import { ConfirmationForbiddenProps } from '../../../../types'

const props: ConfirmationForbiddenProps = {
  selectedPhotos: 0,
  confirmForbidDialogOpen: true,
  setConfirmForbidDialogOpen: jest.fn(),
}

describe('<ConfirmationForbiddenDialog/>', () => {
  let mockStore = { collection: { data: collection } }

  beforeEach(() => {
    mockStore = { collection: { data: collection } }
  })

  test('renders correct min max requirement', async () => {
    render(<ConfirmationForbiddenDialog {...props} />, { initialState: mockStore })

    expect(screen.getByText(/you must select/)).toHaveTextContent(
      'you must select from 1 to 2 photos.',
    )
  })

  test('renders correct max requirement', async () => {
    mockStore.collection.data.minSelect.required = false
    render(<ConfirmationForbiddenDialog {...props} />, { initialState: mockStore })

    expect(screen.getByText(/you must select/)).toHaveTextContent(
      'you must select a maximum of 2 photos.',
    )
  })

  test('renders correct min requirement', async () => {
    mockStore.collection.data.minSelect.required = true
    mockStore.collection.data.maxSelect.required = false
    render(<ConfirmationForbiddenDialog {...props} />, { initialState: mockStore })

    expect(screen.getByText(/you must select/)).toHaveTextContent(
      'you must select at least 1 photos.',
    )
  })

  test('cancel button calls the callback once', async () => {
    render(<ConfirmationForbiddenDialog {...props} />, { initialState: mockStore })

    user.click(screen.getByText(/Cancel/))

    expect(props.setConfirmForbidDialogOpen).toHaveBeenCalledTimes(1)
  })
})
