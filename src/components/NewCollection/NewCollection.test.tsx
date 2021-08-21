import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import user from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { render, waitFor, screen } from '../../utils/customTestRenderer'
import NewCollection from './NewCollection'
import { generateNewCollection } from '../../firebase'

jest.mock('../../firebase')

describe('<NewCollection/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      //
    })
  })

  test('has no violations', async () => {
    const { container } = render(
      <Router>
        <NewCollection />
      </Router>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('entering invalid/missing data renders errors', async () => {
    const { container } = render(
      <Router>
        <NewCollection />
      </Router>,
    )

    expect(container).not.toHaveTextContent('Title is required')
    expect(container).not.toHaveTextContent('Must be higher than maximum value')
    expect(container).not.toHaveTextContent('Must be higher than minimum value')
    expect(container).not.toHaveTextContent('Images are required')

    const minSelectRequired = screen.getByLabelText('minimum')
    user.click(minSelectRequired)
    const maxSelectRequired = screen.getByLabelText('maximum')
    user.click(maxSelectRequired)
    const minSelectGoal = screen.getByTestId(/minSelectGoal/i)
    user.type(minSelectGoal, '4')
    const maxSelectGoal = screen.getByTestId(/maxSelectGoal/i)
    user.type(maxSelectGoal, '3')

    const create = screen.getByRole('button', { name: 'create' })
    user.click(create)

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Must be higher than maximum value')).toBeInTheDocument()
    expect(screen.getByText('Must be higher than minimum value')).toBeInTheDocument()
    expect(screen.getByText('Images are required')).toBeInTheDocument()
  })

  test('upload calls generateNewCollection one time', async () => {
    render(
      <Router>
        <NewCollection />
      </Router>,
    )
    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.jpeg', { type: 'image/jpeg' }),
      new File([new ArrayBuffer(1)], 'file2.jpeg', { type: 'image/jpeg' }),
    ]

    const collectionTitle = screen.getByLabelText(/title/i)
    user.type(collectionTitle, 'test title')

    user.upload(screen.getByTestId('dropzone-input'), filesToUplaod)

    expect(await screen.findByText('file1.jpeg')).toBeInTheDocument()
    expect(screen.getByText('file2.jpeg')).toBeInTheDocument()

    const createButton = screen.getByText('Create')
    user.click(createButton)

    await waitFor(() => {
      expect(generateNewCollection).toHaveBeenCalledTimes(1)
    })
  })
})
