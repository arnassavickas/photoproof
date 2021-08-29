import { useSelector } from 'react-redux'
import { LinearProgress } from '@material-ui/core'

import { RootState } from '../../store'
import styles from './styles.module.scss'

const LinearProgressLoader = () => {
  const progress = useSelector((state: RootState) => state.uiState.loaderProgress)

  if (!progress) return null

  return (
    <div className={styles.absoluteTop}>
      <LinearProgress variant="determinate" value={progress} color="secondary" />
    </div>
  )
}

export default LinearProgressLoader
