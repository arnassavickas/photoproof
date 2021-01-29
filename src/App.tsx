import React, { useState, useEffect } from 'react';
//import UserContext from './providers/UserProvider';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewCollection from './components/NewCollection';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import firebase from 'firebase/app';

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
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>photoproof</h1>
      <div>{user}</div>
      <Router>
        <Switch>
          {!user ? <Route path='/' render={() => <SignIn />} /> : null}
          <Route path='/settings' render={() => <Settings />} />
          <Route path='/new' render={() => <NewCollection />} />
          <Route path='/' render={() => <Dashboard />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
