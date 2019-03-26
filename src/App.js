import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import './App.css';
import { GlobalStateContext, actions } from './GlobalContext';
import { lexRuntime, createMessage } from './lexUtils';
import Header from './components/Header';
import Message from './components/Message';
import MessageList from './components/MessageList';
import UserInput from './components/UserInput';
import FollowUpQuestionButton from './components/FollowUpQuestionButton';
import VisuallyHidden from '@reach/visually-hidden';
import Loader from './components/Loader';

const App = () => {
  const { state, dispatch } = React.useContext(GlobalStateContext);

  const addMessage = message => {
    dispatch({ type: actions.ADD_MESSAGE, message });
  };

  const removeFollowUpQuestionsFromMessage = messageId => {
    dispatch({ type: actions.REMOVE_FOLLOW_UP_QUESTIONS, messageId });
  };

  const postMessage = messageText => {
    if (!messageText) {
      return;
    }

    // Add user's message to messages
    const message = createMessage({ text: messageText });
    addMessage(message);

    // Add loading message
    const loadingMessage = createMessage({ type: 'loading' });
    addMessage(loadingMessage);

    // Post user message to Lex
    lexRuntime
      .postText({
        botName: process.env.REACT_APP_BOT_NAME,
        botAlias: process.env.REACT_APP_BOT_ALIAS,
        userId: `lex-web-ui-${Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)}`,
        inputText: messageText
      })
      .promise()
      .then(data => {
        // Remove loading message
        dispatch({ type: actions.REMOVE_LOADING_MESSAGE });

        // Get markdown-formatted message if supplied
        let markdownMessage;
        if (data.sessionAttributes && data.sessionAttributes.appContext) {
          let appContext = JSON.parse(data.sessionAttributes.appContext);
          if (appContext.altMessages && appContext.altMessages.markdown) {
            markdownMessage = appContext.altMessages.markdown;
          }
        }

        // Get follow-up question prompts
        let followUpQuestions = [];
        if (
          data.responseCard &&
          data.responseCard.genericAttachments &&
          data.responseCard.genericAttachments.length
        ) {
          followUpQuestions = data.responseCard.genericAttachments[0].buttons.map(
            e => e.text
          );
        }

        // Construct message from response data
        const botResponse = createMessage({
          type: 'bot',
          text: markdownMessage ? markdownMessage : data.message,
          followUpQuestions
        });

        // Add response to message list
        addMessage(botResponse);
      })
      .catch(console.log);
  };

  const onMessageEntered = userMessage => {
    // Remove most recent follow-up messages if any exist
    if (state.messages.length) {
      removeFollowUpQuestionsFromMessage(
        state.messages[state.messages.length - 1].id
      );
    }

    // Send user message
    postMessage(userMessage);
  };

  const handleFollowUpClick = (messageId, followUpQuestion) => {
    removeFollowUpQuestionsFromMessage(messageId);
    postMessage(followUpQuestion);
  };

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
      <main>
        <MessageList role="log">
          {state.messages.length > 0 &&
            state.messages.map(({ id, type, text, followUpQuestions }) => {
              if (type === 'loading') {
                return (
                  <Message type="bot" key={id}>
                    <Loader />
                  </Message>
                );
              }
              return (
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Message type={type}>
                    <ReactMarkdown source={text} linkTarget="_blank" />
                  </Message>
                  {followUpQuestions.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                      }}
                    >
                      <VisuallyHidden>
                        Suggested followup questions:
                      </VisuallyHidden>
                      {followUpQuestions.map((question, index) => (
                        <FollowUpQuestionButton
                          onClick={() => handleFollowUpClick(id, question)}
                          key={id + index}
                          tabIndex="10"
                        >
                          {question}
                        </FollowUpQuestionButton>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </MessageList>
        <UserInput onMessageEntered={onMessageEntered} />
      </main>
    </div>
  );
};

export default App;
