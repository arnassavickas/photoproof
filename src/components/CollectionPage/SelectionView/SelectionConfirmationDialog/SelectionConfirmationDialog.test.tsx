import React from 'react';
import { render, screen, waitFor } from '../../../../utils/customTestRenderer';
import user from '@testing-library/user-event';
import SelectionConfirmationDialog from './SelectionConfirmationDialog';
import { collection } from '../../../../utils/testUtils';
import { SelectionConfirmationDialogProps } from '../../../../types';
import { confirmCollection } from '../../../../firebase';

jest.mock('../../../../firebase');

const props: SelectionConfirmationDialogProps = {
  collection,
  setCollection: jest.fn(),
  collectionId: collection.id,
  selectedPhotos: 1,
  confirmDialogOpen: true,
  setConfirmDialogOpen: jest.fn(),
};

describe('<SelectionConfirmationDialog/>', () => {
  test('renders content', async () => {
    render(<SelectionConfirmationDialog {...props} />);

    const text = screen.getByText(/You have selected/);
    const warning = screen.getByText(/you will not be able to select /);

    expect(text.parentElement).toHaveTextContent(/You have selected 1 photos/);
    expect(warning.parentElement).toHaveTextContent(
      /Warning: you will not be able to select more photos after confirming!/
    );
  });

  test('allows to submit without final comment', async () => {
    render(<SelectionConfirmationDialog {...props} />);

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });

    user.click(confirmBtn);

    await waitFor(() => {
      expect(confirmCollection).toHaveBeenCalledWith(
        props.collectionId,
        props.collection.title,
        expect.anything(),
        1,
        ''
      );
    });
  });

  test('submitting calls confirmCollection with comment included', async () => {
    render(<SelectionConfirmationDialog {...props} />);

    const textbox = screen.getByRole('textbox');
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });

    user.type(textbox, 'some final comment');
    user.click(confirmBtn);

    await waitFor(() => {
      expect(confirmCollection).toHaveBeenCalledWith(
        props.collectionId,
        props.collection.title,
        expect.anything(),
        1,
        'some final comment'
      );
    });
  });
});
