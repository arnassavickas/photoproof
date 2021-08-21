import { Button, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

const ErrorPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Button to="/" component={Link} variant="outlined">
        home
      </Button>
      <div className={styles.centeredConainer}>
        <Typography variant="h3">Page not found</Typography>
        <Typography variant="h1">404</Typography>
      </div>
    </div>
  )
}

export default ErrorPage
