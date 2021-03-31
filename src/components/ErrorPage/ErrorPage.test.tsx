import React from 'react';

import { render, screen } from '../../utils/customTestRenderer';
import ErrorPage from './ErrorPage';
import {  Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

jest.mock('../../firebase');

describe('<CollectionPage/>', () => {
  test('renders error page', async () => {
    const history = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <ErrorPage />
      </Router>
    );

    const homeBtn = screen.getByRole('button', { name: 'home' });
    expect(homeBtn).toHaveProperty('href', 'http://localhost/');

    expect(container).toHaveTextContent('Page not found');
    expect(container).toHaveTextContent('404');
  });
});
