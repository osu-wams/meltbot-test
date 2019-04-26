import React, { useEffect, useContext } from 'react';
import queryString from 'query-string';
import ReactGA from 'react-ga';
import './App.css';
import { GlobalStateContext } from './GlobalState';
import Header from './components/Header';
import MessageList from './components/MessageList';
import LoadingDisplay from './components/LoadingDisplay';
import UserInput from './components/UserInput';
import { createMessage } from './lexUtils';

const initialQuestions = [
  { text: 'Advance Tuition Deposit', value: 'I need help with my ATD' },
  { text: 'ONID', value: 'What is an ONID' },
  { text: 'Scholarships', value: 'I need help with my Scholarships' },
  { text: 'Financial Aid', value: 'I need help with Financial Aid' },
  { text: 'Housing', value: 'I need help with Housing' },
  {
    text: 'Immunization requirements',
    value: 'I need help with my Immunization Requirements'
  },
  { text: 'START (orientation)', value: 'What is START' },
  { text: 'Campus visits', value: 'Help with campus visits' }
];

const App = () => {
  const {
    actions: { postMessage, addBotMessage, loadingStart, loadingDone }
  } = useContext(GlobalStateContext);

  useEffect(() => {
    // Post seed (initial) question if provided in query params
    const params = queryString.parse(window.location.search);
    if (params.seed) {
      postMessage(params.seed);
    } else {
      loadingStart();

      const initialMessage = createMessage({
        type: 'bot',
        text:
          'Hello, I am Benny. I am here to help answer questions for first-year students starting at OSU (Corvallis campus) Fall 2019. How can I help?',
        followUpQuestions: initialQuestions
      });

      setTimeout(() => {
        loadingDone();
        addBotMessage(initialMessage);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    ReactGA.pageview('/');
  }, []);

  return (
    <div className="App">
      <Header />
      <MessageList />
      <LoadingDisplay />
      <UserInput />
    </div>
  );
};

export default App;
