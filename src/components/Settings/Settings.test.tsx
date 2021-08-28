import React from 'react'
import { noop } from 'lodash'
import { BrowserRouter as Router } from 'react-router-dom'
import user from '@testing-library/user-event'

import { render, waitFor, screen } from '../../utils/customTestRenderer'
import Settings from './Settings'
import { changeSiteSettings } from '../../firebase'
import { SettingsProps } from '../../types'

jest.mock('../../firebase')

const props: SettingsProps = {
  logoWidth: 100,
  setLogoUrl: jest.fn(),
  setLogoWidth: jest.fn(),
}

describe('<Settings/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(noop)
  })

  test('clicking save calls changeSiteSettings with correct args', async () => {
    render(
      <Router>
        <Settings {...props} />
      </Router>,
    )

    const saveBtn = screen.getByText(/save/i)

    const filesToUplaod = [new File([new ArrayBuffer(1)], 'file1.png', { type: 'image/png' })]

    global.URL.createObjectURL = jest.fn()

    user.upload(screen.getByTestId('settings-file-upload'), filesToUplaod)

    user.click(saveBtn)

    await waitFor(() => {
      expect(changeSiteSettings).toHaveBeenCalledWith(
        expect.anything(),
        props.logoWidth,
        expect.anything(),
      )
    })
  })
})
