import React from 'react'

import user from '@testing-library/user-event'

import { render, screen } from '../../utils/customTestRenderer'
import { FilterButtonsProps } from '../../types'
import FilterButtons from './FilterButtons'
import { collection } from '../../utils/testUtils'

const props: FilterButtonsProps = {
  collection,
  setFilteredPhotos: jest.fn(),
}

const propsModifyLightbox: FilterButtonsProps = {
  collection,
  setFilteredPhotos: jest.fn(),
  modifyLightbox: true,
  setLightboxOpen: jest.fn(),
  photoIndex: 1,
  setPhotoIndex: jest.fn(),
}

describe('<FilterButtons/>', () => {
  test('selected button', async () => {
    render(<FilterButtons {...props} />)

    const selectedBtn = screen.getByRole('button', { name: /^selected/i })
    const allBtn = screen.getByRole('button', { name: /^all/i })

    user.click(selectedBtn)

    expect(props.setFilteredPhotos).toHaveBeenLastCalledWith([collection.photos[1]])

    user.click(allBtn)

    expect(props.setFilteredPhotos).toHaveBeenLastCalledWith(collection.photos)
  })

  test('not selected button', () => {
    render(<FilterButtons {...props} />)

    const notSelectedBtn = screen.getByRole('button', {
      name: /^not selected/i,
    })
    const allBtn = screen.getByRole('button', { name: /^all/i })

    user.click(notSelectedBtn)

    expect(props.setFilteredPhotos).toHaveBeenLastCalledWith([collection.photos[0]])

    user.click(allBtn)

    expect(props.setFilteredPhotos).toHaveBeenLastCalledWith(collection.photos)
  })
})

describe('<FilterButtons modifyLightbox/>', () => {
  test('photoIndex is higher or equal to filtered photos length', () => {
    render(<FilterButtons {...propsModifyLightbox} />)

    const selectedBtn = screen.getByRole('button', { name: /^selected/i })

    user.click(selectedBtn)

    expect(propsModifyLightbox.setPhotoIndex).toHaveBeenCalledWith(0)
  })
  test('filtered photos become zero', () => {
    propsModifyLightbox.collection.photos[1].selected = false
    render(<FilterButtons {...propsModifyLightbox} />)

    const selectedBtn = screen.getByRole('button', { name: /^selected/i })

    user.click(selectedBtn)

    expect(propsModifyLightbox.setLightboxOpen).toHaveBeenCalledWith(false)
  })
})
