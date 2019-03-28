import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import UserInput from '../UserInput';
import { GlobalStateProvider } from '../../GlobalState';

describe('<UserInput />', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages: [] }, actions: { postMessage: jest.fn() } }}
      >
        <UserInput />
      </GlobalStateProvider>
    );

    expect(getByTestId(/userinput/i)).toBeInTheDocument();
  });

  it('should send a message when enter key pressed', () => {
    const postMessage = jest.fn();
    const { getByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages: [] }, actions: { postMessage } }}
      >
        <UserInput />
      </GlobalStateProvider>
    );

    // Simulate typing a message and pressing 'Enter'
    const input = getByTestId(/userinput-input/i);
    fireEvent.change(input, { target: { value: 'message' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith('message');
  });

  it('should send a message when send button clicked', () => {
    const postMessage = jest.fn();
    const { getByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages: [] }, actions: { postMessage } }}
      >
        <UserInput />
      </GlobalStateProvider>
    );

    // Simulate typing a message and clicking the 'send' button
    const input = getByTestId(/userinput-input/i);
    fireEvent.change(input, { target: { value: 'message' } });
    const sendButton = getByTestId(/userinput-sendbutton/i);
    fireEvent.click(sendButton);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith('message');
  });

  it('should clear the input when message sent', () => {
    const postMessage = jest.fn();
    const { getByTestId } = render(
      <GlobalStateProvider
        value={{ state: { messages: [] }, actions: { postMessage } }}
      >
        <UserInput />
      </GlobalStateProvider>
    );

    // Simulate typing a message and pressing 'Enter'
    const input = getByTestId(/userinput-input/i);
    fireEvent.change(input, { target: { value: 'message 1' } });
    expect(input.value).toEqual('message 1');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toEqual('');

    // Simulate typing a message and clicking the 'send' button
    const sendButton = getByTestId(/userinput-sendbutton/i);
    fireEvent.change(input, { target: { value: 'message 2' } });
    expect(input.value).toEqual('message 2');

    fireEvent.click(sendButton);
    expect(input.value).toEqual('');
  });
});
