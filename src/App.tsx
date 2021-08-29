import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container, Backdrop, CircularProgress, Button, Box } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import styles from './styles.module.scss'

import 'react-image-lightbox/style.css'

import Dashboard from './components/Dashboard/Dashboard'
import NewCollection from './components/NewCollection/NewCollection'
import Settings from './components/Settings/Settings'
import SignIn from './components/SignIn/SignIn'
import CollectionPage from './components/CollectionPage/CollectionPage'
import EditCollection from './components/EditCollection/EditCollection'
import ErrorPage from './components/ErrorPage/ErrorPage'
import { auth, getSiteSettings } from './firebase'
import { RootState } from './store'
import { setSiteSettings } from './reducers/siteSettingsSlice'
import { UiState } from './types'

function App() {
  const [user, setUser] = useState<null | string>(null)
  const uiState = useSelector((state: RootState) => state.uiState.value)

  const dispatch = useDispatch()
  const { logoUrl, logoWidth } = useSelector((state: RootState) => state.siteSettings)

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user.uid)
      } else {
        setUser(null)
      }
    })
  }, [])

  useEffect(() => {
    getSiteSettings()
      .then(settings => {
        console.log(settings)
        dispatch(
          setSiteSettings({
            logoUrl: settings?.logoUrl,
            logoWidth: settings?.logoWidth,
            email: settings?.email,
          }),
        )
      })
      .catch(() => {
        enqueueSnackbar('ERROR: Getting site settings failed', {
          variant: 'error',
          persist: true,
        })
      })
  }, [dispatch, enqueueSnackbar])

  return (
    <Container maxWidth="xl">
      <Backdrop
        open={uiState === UiState.Pending}
        transitionDuration={{ appear: 500, enter: 0, exit: 500 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box ml={2} mr={2}>
        {logoUrl && (
          <a href={window.location.origin.toString()}>
            <img className={styles.logo} src={logoUrl} style={{ width: logoWidth }} alt="logo" />
          </a>
        )}
        {user && (
          <div className={styles.logoutBtn}>
            <Button onClick={() => auth.signOut()} variant="outlined">
              Logout
            </Button>
          </div>
        )}
        <Router basename="/photoproof/">
          <Switch>
            <Route path="/collection/:id" render={() => <CollectionPage />} />
            {!user ? <Route path="/" render={() => <SignIn />} /> : null}
            <Route path="/settings" render={() => <Settings />} />
            <Route path="/new" render={() => <NewCollection />} />
            <Route path="/edit/:id" render={() => <EditCollection />} />
            <Route exact path="/" render={() => <Dashboard />} />
            <Route render={() => <ErrorPage />} />
          </Switch>
        </Router>
      </Box>
    </Container>
  )
}

export default App
