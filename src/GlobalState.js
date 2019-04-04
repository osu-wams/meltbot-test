import React, { useReducer } from 'react';
import { createMessage, postMessage as postMessageToLex } from './lexUtils';

const actionType = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  REMOVE_FOLLOW_UP_QUESTIONS: 'REMOVE_FOLLOW_UP_QUESTIONS',
  LOADING_START: 'LOADING_START',
  LOADING_DONE: 'LOADING_DONE',
  INCREMENT_FAILED_SEARCH_COUNT: 'INCREMENT_FAILED_SEARCH_COUNT',
  RESET_FAILED_SEARCH_COUNT: 'RESET_FAILED_SEARCH_COUNT'
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

    case actionType.INCREMENT_FAILED_SEARCH_COUNT:
      return { ...state, failedSearchCount: state.failedSearchCount + 1 };

    case actionType.RESET_FAILED_SEARCH_COUNT:
      return { ...state, failedSearchCount: 0 };

    default:
      console.error('Invalid action type.');
      return state;
  }
};

const initialState = {
  failedSearchCount: 0,
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
        dispatch({ type: actionType.ADD_MESSAGE, message: userMessage });

        // Display loading state
        dispatch({ type: actionType.LOADING_START });

        // Send message and get response from Lex
        const responseMessage = await postMessageToLex(messageText);

        // Clear loading state
        dispatch({ type: actionType.LOADING_DONE });

        // Check if response contains an error message
        const responseContainsErrorMessage = responseMessage.text.match(
          /sorry, i did/i
        );

        if (responseContainsErrorMessage && state.failedSearchCount >= 2) {
          // Offer a mailto link with a chat log for additional help if multiple searches in a row have failed to return results
          let chatLog = state.messages
            .map(
              ({ type, text }) =>
                `${type === 'bot' ? 'Benny:' : 'User:'} ${text}`
            )
            .join('\n\n');

          const mailtoSubject = encodeURIComponent('Help with Benny');
          const mailtoBody = encodeURIComponent(chatLog);
          const mailtoLink = `mailto:admissions@oregonstate.edu?subject=${mailtoSubject}&body=${mailtoBody}`;

          const testMessage = createMessage({
            text: `It looks like I might not be getting you the answers you're looking for. You can contact [Admissions](${mailtoLink}) for more assistance.`,
            type: 'bot'
          });

          dispatch({ type: actionType.ADD_MESSAGE, message: testMessage });
          return;
        } else if (responseContainsErrorMessage) {
          // Increment failed search count if error message returned
          dispatch({ type: actionType.INCREMENT_FAILED_SEARCH_COUNT });
        } else {
          // Reset failed search count on successful search
          dispatch({ type: actionType.RESET_FAILED_SEARCH_COUNT });
        }

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
    },
    addBotMessage(message) {
      dispatch({ type: actionType.ADD_MESSAGE, message });
    },
    loadingStart() {
      dispatch({ type: actionType.LOADING_START });
    },
    loadingDone() {
      dispatch({ type: actionType.LOADING_DONE });
    }
  };

  return <GlobalStateContext.Provider value={{ state, actions }} {...props} />;
};

export { GlobalStateProvider, GlobalStateContext };
