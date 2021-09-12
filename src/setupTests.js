/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'
import { noop } from 'lodash'

Object.assign(navigator, {
  clipboard: {
    writeText: noop,
  },
})
