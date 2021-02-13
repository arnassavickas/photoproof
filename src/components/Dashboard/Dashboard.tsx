import React from 'react';
import { Link } from 'react-router-dom';
import CollectionList from './CollectionsList/CollectionsList';
import { Typography, Button } from '@material-ui/core';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant='h4'>dashboard</Typography>
      <div>

        <Button to='/settings' component={Link} variant='outlined'>
          Settings
        </Button>
        <Button to='/new' component={Link} variant='outlined'>
          Create New Collection
        </Button>
      </div>
      <CollectionList />
    </div>
  );
};

export default Dashboard;
