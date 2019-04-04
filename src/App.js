import React, { useEffect, useContext } from 'react';
import queryString from 'query-string';
import ReactGA from 'react-ga';
import './App.css';
import { GlobalStateContext } from './GlobalState';
import Header from './components/Header';
import MessageList from './components/MessageList';
import UserInput from './components/UserInput';
import { createMessage } from './lexUtils';

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
        followUpQuestions: [
          'I need help with my ATD',
          'What is an ONID',
          'I need help with my Scholarships',
          'I need help with Financial Aid',
          'I need help with Housing',
          'I need help with my Immunization Requirements',
          'What is START',
          'Help with campus visits'
        ].map(e => ({ text: e, value: e }))
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
      <UserInput />
    </div>
  );
};

export default App;
