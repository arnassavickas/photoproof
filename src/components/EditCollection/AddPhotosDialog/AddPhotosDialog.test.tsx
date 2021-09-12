import React from 'react'
import user from '@testing-library/user-event'

import { render, waitFor, screen } from '../../../utils/customTestRenderer'
import { AddPhotosDialogProps } from '../../../types'
import AddPhotosDialog from './AddPhotosDialog'
import { getSingleCollection, addMorePhotos } from '../../../firebase'
import { collection } from '../../../utils/testUtils'

jest.mock('../../../firebase')

const props: AddPhotosDialogProps = {
  addPhotosDialogOpen: true,
  setAddPhotosDialogOpen: jest.fn(),
}

describe('<AddPhotosDialog/>', () => {
  let mockStore = { collections: { collectionsList: [collection], currentId: collection.id } }

  beforeEach(() => {
    mockStore = { collections: { collectionsList: [collection], currentId: collection.id } }
  })

  test('adding no photos renders error', async () => {
    render(<AddPhotosDialog {...props} />, { initialState: mockStore })

    const addButton = screen.getByText('Add')
    user.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Images are required')
    })
  })

  test('adding photos calls firebase functions one time', async () => {
    render(<AddPhotosDialog {...props} />, { initialState: mockStore })
    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.jpeg', { type: 'image/jpeg' }),
      new File([new ArrayBuffer(1)], 'file2.jpeg', { type: 'image/jpeg' }),
    ]

    user.upload(screen.getByTestId('dropzone-input'), filesToUplaod)

    expect(await screen.findByText('file1.jpeg')).toBeInTheDocument()
    expect(screen.getByText('file2.jpeg')).toBeInTheDocument()

    const addButton = screen.getByText('Add')
    user.click(addButton)

    await waitFor(() => {
      expect(addMorePhotos).toHaveBeenCalledTimes(1)
    })
    expect(getSingleCollection).toHaveBeenCalledTimes(1)
  })
})
