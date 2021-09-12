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
import LinearProgressLoader from './components/LinearProgressLoader/LinearProgressLoader'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import { setUiState } from './reducers/uiStateSlice'

function App() {
  const [user, setUser] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    getSiteSettings()
      .then(settings => {
        dispatch(
          setSiteSettings({
            logoUrl: settings?.logoUrl,
            logoWidth: settings?.logoWidth,
            email: settings?.email,
          }),
        )
        dispatch(setUiState(UiState.Success))
      })
      .catch(() => {
        enqueueSnackbar('ERROR: Getting site settings failed', {
          variant: 'error',
          persist: true,
        })
      })
  }, [dispatch, enqueueSnackbar])

  if (isLoading) return null

  return (
    <>
      <LinearProgressLoader />
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
            <ScrollToTop />
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
    </>
  )
}

export default App
