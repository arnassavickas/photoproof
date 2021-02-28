import React from 'react';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { CommentDialogProps } from '../../types';
import CommendDialog from './CommentDialog';

const mockBtn1 = jest.fn();
const mockBtn2 = jest.fn();

const props: CommentDialogProps = {
  commentOpen: true,
  setCommentOpen: jest.fn(),
  commentTextarea: 'comment text area',
  setCommentTextarea: jest.fn(),
  actionButtons: [
    <button key='btn1' onClick={mockBtn1}>
      button1
    </button>,
    <button key='btn2' onClick={mockBtn2}>
      button2
    </button>,
  ],
  disabled: false,
};

describe('<CommendDialog/>', () => {
  test('renders text area with provided text', () => {
    const { getByRole } = render(<CommendDialog {...props} />);

    const textbox = getByRole('textbox');
    expect(textbox).toHaveTextContent('comment text area');
  });

  test('button clicks call their callbacks one time', () => {
    const { getByText } = render(<CommendDialog {...props} />);

    const btn1 = getByText('button1');
    const btn2 = getByText('button2');

    expect(mockBtn1).toHaveBeenCalledTimes(0);
    expect(mockBtn2).toHaveBeenCalledTimes(0);

    user.click(btn1);
    user.click(btn2);

    expect(mockBtn1).toHaveBeenCalledTimes(1);
    expect(mockBtn2).toHaveBeenCalledTimes(1);
  });

  test('typing text calls textarea handler with the text', () => {
    const { getByRole } = render(<CommendDialog {...props} />);

    let textbox = getByRole('textbox');

    user.type(textbox, '1');
    textbox = getByRole('textbox');

    expect(props.setCommentTextarea).toHaveBeenLastCalledWith(
      'comment text area1'
    );
  });
});
