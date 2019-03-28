import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from 'react-testing-library';

import Header from '../Header';

test('Renders without errors', () => {
  render(<Header />);
});

test('Modal will open and close when appropriate buttons are clicked', async () => {
  const { getByText, getByTestId } = render(<Header />);

  // Click on question icon
  const openBtn = getByTestId('about-benny');
  fireEvent.click(openBtn);

  // Verify Modal is present
  const aboutModal = await waitForElement(() => getByText('Hi, I’m Benny!'));
  expect(aboutModal).toBeInTheDocument();

  // Click close button on modal
  const closeBtn = getByTestId('close-about');
  fireEvent.click(closeBtn);

  // Verify modal closed
  expect(aboutModal).not.toBeInTheDocument();
});
