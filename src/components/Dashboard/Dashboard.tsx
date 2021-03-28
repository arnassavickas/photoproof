import React from 'react';
import { Link } from 'react-router-dom';
import CollectionList from './CollectionsList/CollectionsList';
import { Typography, Button, Box as div } from '@material-ui/core';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant='h4'>Collections</Typography>
      <div className='horizontalButtons'>
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
