import React, { useState, useEffect } from 'react';
import './App.scss';
import 'react-image-lightbox/style.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import NewCollection from './components/NewCollectionPage/NewCollection';
import Settings from './components/Settings/Settings';
import SignIn from './components/SignIn/SignIn';
import CollectionPage from './components/CollectionPage/CollectionPage';
import EditCollection from './components/EditCollection/EditCollection';
import firebase from 'firebase/app';
import {
  Container,
  Typography,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';

function App() {
  const [user, setUser] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
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
      <div>{user}</div>
      <Router>
        <Switch>
          <Route path='/collection/:id' render={() => <CollectionPage />} />
          {!user ? <Route path='/' render={() => <SignIn />} /> : null}
          <Route path='/settings' render={() => <Settings />} />
          <Route path='/new' render={() => <NewCollection />} />
          <Route path='/edit/:id' render={() => <EditCollection />} />
          <Route path='/' render={() => <Dashboard />} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
