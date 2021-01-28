import React from 'react';
import { Link } from 'react-router-dom';
import CollectionList from './CollectionList';
import { collections } from '../tempData/tempData';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>dashboard</h2>
      <div>
        <button>Logout</button>
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
