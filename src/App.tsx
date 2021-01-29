import React, { useState, useEffect } from 'react';
//import UserContext from './providers/UserProvider';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewCollection from './components/NewCollection';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import firebase from 'firebase/app';
import { getCollections } from './firebase';

function App() {
  const [user, setUser] = useState<null | string>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div>
      <h1>photoproof</h1>
      <div>{user}</div>
      <Router>
        <Switch>
          {user ? <Route path='/settings' render={() => <Settings />} /> : null}
          {user ? <Route path='/new' render={() => <NewCollection />} /> : null}
          {user ? <Route path='/' render={() => <Dashboard />} /> : null}
          <Route path='/' render={() => <SignIn />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
