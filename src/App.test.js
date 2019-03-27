import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalStateProvider } from './GlobalContext';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
