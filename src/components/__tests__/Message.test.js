import React from 'react';
import { render } from '@testing-library/react';
import Message from '../Message';

const BotMessage = () => (
  <Message type="bot">
    <p>Bot Message</p>
  </Message>
);

const UserMessage = () => (
  <Message type="user">
    <p>User Message</p>
  </Message>
);

const FollowUpQuestion = () => (
  <Message>
    <p>Follow up question button</p>
  </Message>
);

test('BotMessage - Message with type="bot" is styled appropriately', () => {
  const { container } = render(<BotMessage />);
  expect(container).toMatchSnapshot();
});

test('UserMessage - Message with type="user" is styled appropriately', () => {
  const { container } = render(<UserMessage />);
  expect(container).toMatchSnapshot();
});

test('FollowUpQuestion - Message with no type - is styled appropriately', () => {
  const { container } = render(<FollowUpQuestion />);
  expect(container).toMatchSnapshot();
});
