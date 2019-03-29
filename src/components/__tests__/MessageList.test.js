import React from 'react';
import { render, fireEvent } from 'react-testing-library';
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
    followUpQuestions: [
      'What is your name?',
      'What is your quest?',
      'What... is your favorite colour?'
    ]
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

  it('should render follow-up questions for messages when provided', () => {
    const { getAllByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages }, actions: { postMessage: jest.fn() } }}
      >
        <MessageList />
      </GlobalStateProvider>
    );

    const followUpButtons = getAllByTestId(/followup-button/i);
    expect(followUpButtons).toHaveLength(3);
  });

  it('should send a message when a follow-up question is clicked', () => {
    const postMessage = jest.fn();
    const { getByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages }, actions: { postMessage } }}
      >
        <MessageList />
      </GlobalStateProvider>
    );

    const followUpButton = getByTestId(/followup-button/i);
    fireEvent.click(followUpButton);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(followUpButton.innerHTML);
  });
});
