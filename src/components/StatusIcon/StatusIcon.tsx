import React from 'react'
import { Tooltip } from '@material-ui/core'
import BlockIcon from '@material-ui/icons/Block'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import CheckIcon from '@material-ui/icons/Check'

import { StatusIconProps } from '../../types'

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case 'editing':
      return (
        <Tooltip title="Editing">
          <BlockIcon />
        </Tooltip>
      )
    case 'selecting':
      return (
        <Tooltip title="Selecting">
          <TouchAppIcon />
        </Tooltip>
      )
    case 'confirmed':
      return (
        <Tooltip title="Confirmed">
          <CheckIcon />
        </Tooltip>
      )
    default:
      return <div>N/A</div>
  }
}

export default StatusIcon
