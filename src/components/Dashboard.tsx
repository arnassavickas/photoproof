import React from 'react';
import { Link } from 'react-router-dom';
import CollectionList from './CollectionList';
import { collections } from '../tempData/tempData';
import { auth } from '../firebase';

const Dashboard: React.FC = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div>
      <h2>dashboard</h2>
      <div>
        <button onClick={handleLogout}>Logout</button>
        <Link to='/login'>
          <button>Login</button>
        </Link>
        <Link to='/settings'>
          <button>Settings</button>
        </Link>
        <Link to='/new'>
          <button>Create New Collection</button>
        </Link>
      </div>
      <CollectionList collections={collections} />
    </div>
  );
};

export default Dashboard;
