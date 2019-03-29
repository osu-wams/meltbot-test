import React, { useEffect, useContext } from 'react';
import queryString from 'query-string';
import './App.css';
import { GlobalStateContext } from './GlobalState';
import Header from './components/Header';
import MessageList from './components/MessageList';
import UserInput from './components/UserInput';

const App = () => {
  const {
    actions: { postMessage }
  } = useContext(GlobalStateContext);

  useEffect(() => {
    // Post seed (initial) question if provided in query params
    const params = queryString.parse(window.location.search);
    if (params.seed) {
      postMessage(params.seed);
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <MessageList role="log" />
      <UserInput />
    </div>
  );
};

export default App;
