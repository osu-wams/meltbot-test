import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalStateProvider } from '../../GlobalState';
import Header from '../Header';

const renderWithGlobalState = el => {
  return render(<GlobalStateProvider>{el}</GlobalStateProvider>);
};

test('Renders without errors', () => {
  renderWithGlobalState(<Header />);
});

test('Modal will open and close when appropriate buttons are clicked', async () => {
  const { findByText, getByTestId, queryByText } = renderWithGlobalState(
    <Header />
  );

  // Click on question icon
  const openBtn = getByTestId('about-benny');
  userEvent.click(openBtn);

  // Verify Modal is present
  const aboutModal = await findByText('Chat with Benny');
  expect(aboutModal).toBeInTheDocument();

  // Click close button on modal
  const closeBtn = getByTestId('close-about');
  userEvent.click(closeBtn);

  const aboutModalAfterClose = queryByText('Chat with Benny');
  // Verify modal closed
  expect(aboutModalAfterClose).toBeNull();
});
