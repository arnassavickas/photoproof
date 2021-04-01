import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import 'react-image-lightbox/style.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import NewCollection from './components/NewCollection/NewCollection';
import Settings from './components/Settings/Settings';
import SignIn from './components/SignIn/SignIn';
import CollectionPage from './components/CollectionPage/CollectionPage';
import EditCollection from './components/EditCollection/EditCollection';
import ErrorPage from './components/ErrorPage/ErrorPage';
import { auth, getSiteSettings } from './firebase';
import {
  Container,
  Backdrop,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

function App() {
  const [user, setUser] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoWidth, setLogoWidth] = useState(100);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUser(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, [enqueueSnackbar]);

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings && settings.logoUrl && settings.logoWidth) {
          setLogoUrl(settings.logoUrl);
          setLogoWidth(settings.logoWidth);
        }
      })
      .catch((err) => {
        enqueueSnackbar('ERROR: Getting site settings failed', {
          variant: 'error',
          persist: true,
        });
      });
  }, [enqueueSnackbar]);

  if (loading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  return (
    <Container>
      {logoUrl && (
        <img
          className={styles.logo}
          src={logoUrl}
          style={{ width: logoWidth }}
          alt='logo'
        />
      )}
      {user && (
        <div className={styles.logoutBtn}>
          <Button onClick={() => auth.signOut()} variant='outlined'>
            Logout
          </Button>
        </div>
      )}
      <Router basename={'/photoproof/'}>
        <Switch>
          <Route path='/collection/:id' render={() => <CollectionPage />} />
          {!user ? <Route path='/' render={() => <SignIn />} /> : null}
          <Route
            path='/settings'
            render={() => (
              <Settings
                logoWidth={logoWidth}
                setLogoUrl={setLogoUrl}
                setLogoWidth={setLogoWidth}
              />
            )}
          />
          <Route path='/new' render={() => <NewCollection />} />
          <Route path='/edit/:id' render={() => <EditCollection />} />
          <Route exact path='/' render={() => <Dashboard />} />
          <Route render={() => <ErrorPage />} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
