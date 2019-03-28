import React from 'react';
import { render } from 'react-testing-library';
import MessageList from '../MessageList';
import { GlobalStateProvider } from '../../GlobalState';

const messages = [
  {
    id: 1,
    type: 'user',
    text: 'Message 1',
    followUpQuestions: []
  },
  {
    id: 2,
    type: 'bot',
    text: 'Message 2',
    followUpQuestions: []
  }
];

describe('<MessageList />', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages: [] }, actions: { postMessage: jest.fn() } }}
      >
        <MessageList />
      </GlobalStateProvider>
    );
    expect(getByTestId(/messagelist/i)).toBeInTheDocument();
  });

  it('should render messages from state', () => {
    const { getAllByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages }, actions: { postMessage: jest.fn() } }}
      >
        <MessageList />
      </GlobalStateProvider>
    );

    expect(getAllByTestId(/^message$/i).length).toEqual(2);
  });
});
