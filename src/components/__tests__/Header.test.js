import React from 'react';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import { GlobalStateProvider } from '../../GlobalState';
import Header from '../Header';

const renderWithGlobalState = el => {
  return render(<GlobalStateProvider>{el}</GlobalStateProvider>);
};

test('Renders without errors', () => {
  renderWithGlobalState(<Header />);
});

test('Modal will open and close when appropriate buttons are clicked', async () => {
  const { getByText, getByTestId } = renderWithGlobalState(<Header />);

  // Click on question icon
  const openBtn = getByTestId('about-benny');
  fireEvent.click(openBtn);

  // Verify Modal is present
  const aboutModal = await waitForElement(() => getByText('Chat with Benny'));
  expect(aboutModal).toBeInTheDocument();

  // Click close button on modal
  const closeBtn = getByTestId('close-about');
  fireEvent.click(closeBtn);

  // Verify modal closed
  expect(aboutModal).not.toBeInTheDocument();
});
