import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import ConfirmationForbiddenDialog from './ConfirmationForbiddenDialog';
import { collection } from '../../../../utils/testUtils';
import { ConfirmationForbiddenProps } from '../../../../types';

const props: ConfirmationForbiddenProps = {
  collection,
  selectedPhotos: 0,
  confirmForbidDialogOpen: true,
  setConfirmForbidDialogOpen: jest.fn(),
};

describe('<ConfirmationForbiddenDialog/>', () => {
  test('renders correct min max requirement', async () => {
    render(<ConfirmationForbiddenDialog {...props} />);

    const text = screen.getByText(/You have selected/);

    expect(text.parentElement).toHaveTextContent(
      /you must select from 1 to 2 photos./
    );
  });

  test('renders correct max requirement', async () => {
    props.collection.minSelect.required = false;
    render(<ConfirmationForbiddenDialog {...props} />);

    const text = screen.getByText(/You have selected/);

    expect(text.parentElement).toHaveTextContent(
      /you must select a maximum of 2 photos./
    );
  });

  test('renders correct min requirement', async () => {
    props.collection.minSelect.required = true;
    props.collection.maxSelect.required = false;
    render(<ConfirmationForbiddenDialog {...props} />);

    const text = screen.getByText(/You have selected/);

    expect(text.parentElement).toHaveTextContent(
      /you must select at least 1 photos./
    );
  });

  test('cancel button calls the callback once', async () => {
    render(<ConfirmationForbiddenDialog {...props} />);

    const text = screen.getByText(/Cancel/);
    user.click(text);

    expect(props.setConfirmForbidDialogOpen).toHaveBeenCalledTimes(1);
  });
});
