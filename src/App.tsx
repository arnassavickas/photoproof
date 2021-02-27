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
import { auth } from './firebase';
import {
  Container,
  Typography,
  Backdrop,
  CircularProgress,
  Button,
} from '@material-ui/core';

function App() {
  const [user, setUser] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUser(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color='inherit' />.
      </Backdrop>
    );
  }

  return (
    <Container>
      <Typography variant='h2'>photoproof</Typography>
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
          <Route path='/settings' render={() => <Settings />} />
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
