import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CollectionList from './CollectionList';
import { auth, getCollections } from '../firebase';
import { Collection } from '../types';

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
      <CollectionList/>
    </div>
  );
};

export default Dashboard;
