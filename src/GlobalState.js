import React, { useReducer } from 'react';
import { createMessage, postMessage as postMessageToLex } from './lexUtils';
import ReactGA from 'react-ga';
import config from './config';

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
      return { ...state, loading: true };

    case actionType.LOADING_DONE:
      return { ...state, loading: false };

    default:
      console.error('Invalid action type.');
      return state;
  }
};

const initialState = {
  loading: true,
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

        // If 'help' message entered,
        const isHelpMessage = messageText.match(/^help$/i);
        if (isHelpMessage) {
          // Offer a mailto link with a chat log for additional help if multiple searches in a row have failed to return results
          let chatLog = state.messages
            .map(
              ({ type, text }) =>
                `${type === 'bot' ? 'Benny:' : 'User:'} ${text}`
            )
            .join('\n\n');

          const chatTranscript = encodeURIComponent(chatLog);
          const helpLink = `${
            config.HELP_FORM_URL
          }?transcript=${chatTranscript}`;

          const helpMessage = createMessage({
            text: `I’m sorry, I don’t understand your question. I’m still learning, so try asking again in a 
              different way or [get in touch with Admissions](${helpLink}).`,
            type: 'bot'
          });

          // Clear loading state
          dispatch({ type: actionType.LOADING_DONE });

          // Add help message to message list
          dispatch({ type: actionType.ADD_MESSAGE, message: helpMessage });

          // Bail out early so we don't send a request to Lex
          return;
        }

        // Send message and get response from Lex
        const responseMessage = await postMessageToLex(messageText);

        // Clear loading state
        dispatch({ type: actionType.LOADING_DONE });

        // Check if response contains an error message
        const responseContainsErrorMessage = responseMessage.text.match(
          /(sorry, i did|You stumped me!)/i
        );

        if (responseContainsErrorMessage) {
          ReactGA.event({
            category: 'FailedSearch',
            action: 'Question lead to a failed search',
            label: messageText
          });
        }

        if (responseContainsErrorMessage) {
          // Offer a mailto link with a chat log for additional help if multiple searches in a row have failed to return results
          let chatLog = state.messages
            .map(
              ({ type, text }) =>
                `${type === 'bot' ? 'Benny:' : 'User:'} ${text}`
            )
            .join('\n\n');

          const chatTranscript = encodeURIComponent(chatLog);
          const helpLink = `${
            config.HELP_FORM_URL
          }?transcript=${chatTranscript}`;

          const helpMessage = createMessage({
            text: `Hi, I’m Benny!  
              I am here to help answer questions for first-year students starting at OSU (Corvallis campus) Fall 2019. 
              I’m still learning, so if I’m not able to help you, [please contact Admissions](${helpLink}).`,
            type: 'bot'
          });

          dispatch({ type: actionType.ADD_MESSAGE, message: helpMessage });
          return;
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
