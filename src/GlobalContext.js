import React, { useReducer } from 'react';

const GlobalStateContext = React.createContext(null);

// Initialize global state
const initialState = {
  messages: []
};

const actions = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  REMOVE_FOLLOW_UP_QUESTIONS: 'REMOVE_FOLLOW_UP_QUESTIONS',
  REMOVE_LOADING_MESSAGE: 'REMOVE_LOADING_MESSAGE'
};

const reducer = (state, action) => {
  let messages;
  let targetMessage;

  switch (action.type) {
    case actions.ADD_MESSAGE:
      return { messages: [...state.messages, action.message] };

    case actions.REMOVE_FOLLOW_UP_QUESTIONS:
      messages = state.messages;
      targetMessage = messages.find(e => e.id === action.messageId);
      if (targetMessage) {
        let targetMessageIndex = messages.indexOf(targetMessage);
        messages[targetMessageIndex].followUpQuestions = [];
        return { messages };
      } else {
        return state;
      }

    case actions.REMOVE_LOADING_MESSAGE:
      messages = state.messages;
      targetMessage = messages.find(e => e.type === 'loading');
      messages.splice(messages.indexOf(targetMessage), 1);
      return { messages };

    default:
      throw new Error('AAAAAAAAAA');
  }
};

const GlobalStateProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <GlobalStateContext.Provider value={value}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};

const GlobalStateConsumer = GlobalStateContext.Consumer;

export {
  GlobalStateContext,
  GlobalStateConsumer,
  GlobalStateProvider,
  actions
};
