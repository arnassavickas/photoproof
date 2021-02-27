import React from 'react';

import {
  getByLabelText,
  getByText,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { CollectionDetailsProps } from '../../../types';
import user from '@testing-library/user-event';
import CollectionDetails from './CollectionDetails';
import { collection, filteredPhotos } from '../../../utils/testUtils';
import { changeCollectionStatus, updateSettings } from '../../../firebase';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../firebase');

const props: CollectionDetailsProps = {
  collectionId: 'collectionId',
  collection,
  setCollection: jest.fn(),
  filteredPhotos,
  setConfirmationDialogOpen: jest.fn(),
  setConfirmationDialogTitle: jest.fn(),
  setConfirmationDialogContentText: jest.fn(),
  setConfirmationDialogAgree: jest.fn(),
  setProgress: jest.fn(),
};

describe('<PhotoTableToolbar/> selecting', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('clicking "edit" button calls changeCollectionStatus one time', async () => {
    const { getByText, debug, getByRole } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );

    const editButton = getByText('Edit');
    user.click(editButton);
    await waitFor(() => {
      expect(changeCollectionStatus).toHaveBeenCalledTimes(1);
    });
  });

  test('clicking "copy selections" calls copySelections one time', async () => {
    const { getByText, debug, getByRole } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );
    const copyButton = getByText(/copy selections/i);
    user.click(copyButton);

    await waitFor(() => {
      expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1);
    });
  });
});

describe('<PhotoTableToolbar/> confirmed', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  beforeAll(() => {
    props.collection.status = 'confirmed';
  });

  test('clicking "edit" button calls setConfirmationDialogAgree one time', async () => {
    const { getByText, debug, getByRole } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );

    const editButton = getByText('Edit');
    user.click(editButton);

    await waitFor(() => {
      expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1);
    });
  });

  test('clicking "copy selections" calls navigator.clipboard.writeText one time', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');

    const { getByText, debug, getByRole } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );

    const copyButton = getByText(/copy selections/i);
    user.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });
  });
});

describe('<PhotoTableToolbar/> editing', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  beforeAll(() => {
    props.collection.status = 'editing';
  });

  test('saving empty title renders error', async () => {
    const { getByText, debug, getByLabelText, baseElement } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );

    const title = getByLabelText('Title');
    user.clear(title);

    const saveButton = getByText('Save');
    user.click(saveButton);

    await waitFor(() => {
      expect(baseElement).toHaveTextContent('Title is required');
    });
  });

  test('entering valid data calls updateSettings one time with correct args', async () => {
    const {
      getByText,
      debug,
      getByLabelText,
      baseElement,
      getByTestId,
    } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );

    const title = getByLabelText('Title');
    user.clear(title);
    user.type(title, 'new title');

    const allowComments = getByLabelText('Allow comments');
    user.click(allowComments);

    const minSelectRequired = getByLabelText('minimum');
    user.click(minSelectRequired);
    const maxSelectGoal = getByTestId('maxSelectGoal').querySelector(
      'input'
    ) as HTMLInputElement;
    user.clear(maxSelectGoal);
    user.type(maxSelectGoal, '4');

    const saveButton = getByText('Save');
    user.click(saveButton);

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledTimes(1);
      expect(updateSettings).toHaveBeenCalledWith(
        {
          title: 'new title',
          minSelect: {
            required: false,
            goal: 1,
          },
          maxSelect: {
            required: true,
            goal: 4,
          },
          allowComments: false,
        },
        'collectionId'
      );
    });
  });

  test('clicking "copy selections" calls navigator.clipboard.writeText one time', async () => {
    const { getByText, debug, getByRole } = render(
      <Router>
        <CollectionDetails {...props} />
      </Router>
    );

    const copyButton = getByText(/copy selections/i);
    user.click(copyButton);

    await waitFor(() => {
      expect(props.setConfirmationDialogAgree).toHaveBeenCalledTimes(1);
    });
  });
});
