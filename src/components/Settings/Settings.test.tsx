import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import user from '@testing-library/user-event'
import { noop } from 'lodash'

import { render, waitFor, screen } from '../../utils/customTestRenderer'
import Settings from './Settings'
import * as firebase from '../../firebase'
import * as siteSettingsSlice from '../../reducers/siteSettingsSlice'

const changeSiteSettings = jest.spyOn(firebase, 'changeSiteSettings')
jest.spyOn(siteSettingsSlice, 'setLogoWidth')

describe('<Settings/>', () => {
  let mockStore = { siteSettings: { logoWidth: 100, email: 'email' } }

  beforeEach(() => {
    mockStore = { siteSettings: { logoWidth: 100, email: 'email' } }
    global.URL.createObjectURL = jest.fn()
    changeSiteSettings.mockReturnValue(new Promise(noop))
  })

  test('clicking save calls changeSiteSettings with correct args', async () => {
    render(
      <Router>
        <Settings />
      </Router>,
      { initialState: mockStore },
    )

    const filesToUplaod = [new File([], 'file1.png', { type: 'image/png' })]

    user.upload(screen.getByTestId('settings-file-upload'), filesToUplaod)

    user.click(screen.getByText(/save/i))

    await waitFor(() => {
      expect(changeSiteSettings).toHaveBeenCalledWith(
        expect.anything(),
        100,
        'email',
        expect.anything(),
      )
    })
  })
})
