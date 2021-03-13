import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';
import ReactGA from 'react-ga';
import config from './config';

ReactGA.initialize(config.GA_TRACKING_ID, {
  testMode: true
});
