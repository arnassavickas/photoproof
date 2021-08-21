import React from 'react'

import user from '@testing-library/user-event'

import { render, screen } from '../../utils/customTestRenderer'
import ConfirmationDialog from './ConfirmationDialog'
import { ConfirmationDialogProps } from '../../types'

const props: ConfirmationDialogProps = {
  dialogOpen: true,
  progress: 0,
  onClickCancel: jest.fn(),
  onClickAgree: jest.fn(),
  dialogTitle: 'test title',
  dialogContentText: 'test content text',
}

describe('<ConfirmationDialog/>', () => {
  test('renders title and text', () => {
    render(<ConfirmationDialog {...props} />)
    expect(screen.getByText(/test title/)).toBeInTheDocument()
    expect(screen.getByText(/test content text/)).toBeInTheDocument()
  })

  test('button clicks call their callbacks one time', () => {
    render(<ConfirmationDialog {...props} />)
    const yesBtn = screen.getByText('Yes')
    const cancelBtn = screen.getByText('Cancel')

    expect(props.onClickAgree).toHaveBeenCalledTimes(0)
    expect(props.onClickAgree).toHaveBeenCalledTimes(0)

    user.click(yesBtn)
    user.click(cancelBtn)

    expect(props.onClickAgree).toHaveBeenCalledTimes(1)
    expect(props.onClickAgree).toHaveBeenCalledTimes(1)
  })

  test('positive progress disables buttons', () => {
    props.progress = 1
    render(<ConfirmationDialog {...props} />)
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
