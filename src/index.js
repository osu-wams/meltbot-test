import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import './index.css';
import App from './App';
import { GlobalStateProvider } from './GlobalState';
import config from './config';

// Initialize Google Analytics
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// When running tests, intialize in ./setupTests.js instead
if (!isTest) {
  ReactGA.initialize(config.GA_TRACKING_ID, {
    debug: isDevelopment,
    gaOptions: {
      siteSpeedSampleRate: 100
    }
  });
}

ReactDOM.render(
  <GlobalStateProvider>
    <App />
  </GlobalStateProvider>,
  document.getElementById('root')
);
