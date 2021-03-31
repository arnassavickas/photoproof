import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor, screen } from '../../utils/customTestRenderer';
import user from '@testing-library/user-event';
import Settings from './Settings';
import { changeSiteSettings } from '../../firebase';
import { SettingsProps } from '../../types';

jest.mock('../../firebase');

const props: SettingsProps = {
  logoWidth: 100,
  setLogoUrl: jest.fn(),
  setLogoWidth: jest.fn(),
};

describe('<Settings/>', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('clicking save calls changeSiteSettings with correct args', async () => {
    const { container} = render(
      <Router>
        <Settings {...props} />
      </Router>
    );

    const saveBtn = screen.getByText(/save/i);

    const filesToUplaod = [
      new File([new ArrayBuffer(1)], 'file1.png', { type: 'image/png' }),
    ];

    const fileInput = container.querySelector('input[type="file"]');

    global.URL.createObjectURL = jest.fn();

    user.upload(fileInput as HTMLElement, filesToUplaod);

    user.click(saveBtn);

    await waitFor(() => {
      expect(changeSiteSettings).toHaveBeenCalledWith(
        expect.anything(),
        props.logoWidth,
        expect.anything()
      );
    });
  });
});
