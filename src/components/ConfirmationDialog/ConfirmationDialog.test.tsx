import React from 'react'

import user from '@testing-library/user-event'

import { render, screen } from '../../utils/customTestRenderer'
import ConfirmationDialog from './ConfirmationDialog'
import { ConfirmationDialogProps } from '../../types'

const props: ConfirmationDialogProps = {
  dialogOpen: true,
  onClickCancel: jest.fn(),
  onClickAgree: jest.fn(),
  dialogTitle: 'test title',
  dialogContentText: 'test content text',
}

let mockStore = { uiState: { loaderProgress: 0 } }

beforeEach(() => {
  mockStore = { uiState: { loaderProgress: 0 } }
})

describe('<ConfirmationDialog/>', () => {
  test('renders title and text', () => {
    render(<ConfirmationDialog {...props} />, { initialState: mockStore })
    expect(screen.getByText(/test title/)).toBeInTheDocument()
    expect(screen.getByText(/test content text/)).toBeInTheDocument()
  })

  test('button clicks call their callbacks one time', () => {
    render(<ConfirmationDialog {...props} />, { initialState: mockStore })
    const yesBtn = screen.getByText('Yes')
    const cancelBtn = screen.getByText('Cancel')

    expect(props.onClickAgree).toHaveBeenCalledTimes(0)
    expect(props.onClickAgree).toHaveBeenCalledTimes(0)

    user.click(yesBtn)
    user.click(cancelBtn)

    expect(props.onClickAgree).toHaveBeenCalledTimes(1)
    expect(props.onClickAgree).toHaveBeenCalledTimes(1)
  })

  describe('when progress is not zero', () => {
    beforeEach(() => {
      mockStore.uiState.loaderProgress = 1
    })

    test('buttons are disabled', () => {
      render(<ConfirmationDialog {...props} />, { initialState: mockStore })
      const yesBtn = screen.getByText('Yes')
      const cancelBtn = screen.getByText('Cancel')

      expect(props.onClickAgree).toHaveBeenCalledTimes(0)
      expect(props.onClickAgree).toHaveBeenCalledTimes(0)

      user.click(yesBtn)
      user.click(cancelBtn)

      expect(props.onClickAgree).toHaveBeenCalledTimes(0)
      expect(props.onClickAgree).toHaveBeenCalledTimes(0)
    })
  })
})
