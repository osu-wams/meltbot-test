import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';
import ReactGA from 'react-ga';
import config from './config';

// Remove this when CRA updates to jsdom 16+ (not available as of CRA 3.4)
import MutationObserver from '@sheerun/mutationobserver-shim';
window.MutationObserver = MutationObserver;

ReactGA.initialize(config.GA_TRACKING_ID, {
  testMode: true
});
