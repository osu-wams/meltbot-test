import React, { useReducer } from 'react';
import { createMessage, postMessage as postMessageToLex } from './lexUtils';

const actionType = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  REMOVE_FOLLOW_UP_QUESTIONS: 'REMOVE_FOLLOW_UP_QUESTIONS',
  LOADING_START: 'LOADING_START',
  LOADING_DONE: 'LOADING_DONE'
};

const reducer = (state, action) => {
  let messages;
  let targetMessage;

  switch (action.type) {
    case actionType.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };

    case actionType.REMOVE_FOLLOW_UP_QUESTIONS:
      messages = state.messages;
      const targetMessages = messages.filter(
        e => e.followUpQuestions && e.followUpQuestions.length
      );
      if (targetMessages.length) {
        messages = messages.map(e => {
          if (targetMessages.includes(e)) {
            return { ...e, followUpQuestions: [] };
          }
          return e;
        });
        return { ...state, messages };
      }
      return state;

    case actionType.LOADING_START:
      const loadingMessage = createMessage({ type: 'loading' });
      return { ...state, messages: [...state.messages, loadingMessage] };

    case actionType.LOADING_DONE:
      messages = state.messages;
      targetMessage = messages.find(e => e.type === 'loading');
      messages.splice(messages.indexOf(targetMessage), 1);
      return { ...state, messages };

    default:
      console.error('Invalid action type.');
      return state;
  }
};

const initialState = {
  messages: []
};

const GlobalStateContext = React.createContext(null);

const GlobalStateProvider = ({ ...props }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    async postMessage(messageText) {
      try {
        // Clear any previous follow-up question buttons
        dispatch({ type: actionType.REMOVE_FOLLOW_UP_QUESTIONS });

        // Add user's message to message list
        const userMessage = createMessage({
          type: 'user',
          text: messageText
        });
        console.log(userMessage);
        dispatch({ type: actionType.ADD_MESSAGE, message: userMessage });

        // Display loading state
        dispatch({ type: actionType.LOADING_START });

        // Send message and get response from Lex
        const responseMessage = await postMessageToLex(messageText);
        console.log();

        // Clear loading state
        dispatch({ type: actionType.LOADING_DONE });

        // Add returned message to message list
        dispatch({ type: actionType.ADD_MESSAGE, message: responseMessage });
      } catch (err) {
        // Clear loading state
        dispatch({ type: actionType.LOADING_DONE });

        // Display error message
        const errorMessage = createMessage({
          type: 'bot',
          text: `Sorry, I'm having trouble retrieving that info. Please ask again in a moment.`
        });
        dispatch({ type: actionType.ADD_MESSAGE, message: errorMessage });
      }
    }
  };

  return <GlobalStateContext.Provider value={{ state, actions }} {...props} />;
};

export { GlobalStateProvider, GlobalStateContext };
