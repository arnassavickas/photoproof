import React, { useState, useEffect } from 'react';
//import UserContext from './providers/UserProvider';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewCollection from './components/NewCollection';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import firebase from 'firebase/app';

function App() {
  const [user, setUser] = useState('');

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(JSON.stringify(user.uid));
      } else {
        // No user is signed in.
      }
    });
  }, []);

  return (
    <div>
      <h1>photoproof</h1>
      <div>{user}</div>
      <Router>
        <Switch>
          <Route path='/settings' render={() => <Settings />} />
          <Route path='/new' render={() => <NewCollection />} />
          <Route path='/dashboard' render={() => <Dashboard />} />
          <Route path='/login' render={() => <SignIn />} />
          <Route path='/' render={() => <div>hi</div>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
