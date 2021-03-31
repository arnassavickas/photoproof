import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import NotificationProvider from '../providers/NotificationProvider';

const AllTheProviders: React.FC = ({ children }) => (
  <NotificationProvider>{children}</NotificationProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
