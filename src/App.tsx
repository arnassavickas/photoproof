import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewCollection from './components/NewCollection';
import Settings from './components/Settings'

function App() {
  return (
    <div>
      <h1>photoproof</h1>
      <Router>
        <Switch>
          <Route path='/settings' render={() => <Settings />} />
          <Route path='/new' render={() => <NewCollection />} />
          <Route path='/' render={() => <Dashboard />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
