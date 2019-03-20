import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext
} from 'react';
import { LexRuntime, CognitoIdentityCredentials } from 'aws-sdk';
import styled from 'styled-components';
import generateId from 'uuid/v4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';
import './App.css';
import Header from './components/Header';
import Message from './components/Message';
import UserInput from './components/UserInput';
import UserInputWrapper from './components/UserInputWrapper';

var lexRuntime = new LexRuntime({
  apiVersion: '2016-11-28',
  region: process.env.REACT_APP_REGION,
  credentials: new CognitoIdentityCredentials(
    { IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID },
    { region: process.env.REACT_APP_REGION }
  )
});

// Initialize global state
const initialState = {
  messages: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_MESSAGE:
      return { messages: [...state.messages, action.message] };

    case actions.REMOVE_FOLLOW_UP_QUESTIONS:
      let messages = state.messages;
      let targetMessage = messages.find(e => e.id === action.messageId);
      if (targetMessage) {
        let targetMessageIndex = messages.indexOf(targetMessage);
        messages[targetMessageIndex].followUpQuestions = [];
        return { messages };
      } else {
        return state;
      }

    default:
      throw new Error('AAAAAAAAAA');
  }
};

const actions = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  REMOVE_FOLLOW_UP_QUESTIONS: 'REMOVE_FOLLOW_UP_QUESTIONS'
};

const GlobalStateContext = React.createContext(null);

const createMessage = ({ type = 'user', text, followUpQuestions = [] }) => ({
  id: generateId(),
  type,
  text,
  followUpQuestions
});

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [userMessage, setUserMessage] = useState('');

  const addMessage = message => {
    dispatch({ type: actions.ADD_MESSAGE, message });
  };

  const removeFollowUpQuestionsFromMessage = messageId => {
    dispatch({ type: actions.REMOVE_FOLLOW_UP_QUESTIONS, messageId });
  };

  const postMessage = messageText => {
    // Add user's message to messages
    const message = createMessage({ text: messageText });
    addMessage(message);

    // Clear input
    setUserMessage('');

    // Post user message to Lex
    lexRuntime
      .postText({
        botName: 'QnABot_BotwR',
        botAlias: '$LATEST',
        userId: `lex-web-ui-${Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)}`,
        inputText: messageText
      })
      .promise()
      .then(data => {
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
        const botResponse = createMessage({
          type: 'bot',
          text: data.message,
          followUpQuestions
        });
        addMessage(botResponse);
      })
      .catch(console.log);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      // Remove most recent follow-up messages if any exist
      if (state.messages.length) {
        removeFollowUpQuestionsFromMessage(
          state.messages[state.messages.length - 1].id
        );
      }

      // Send user message
      postMessage(userMessage);
    }
  };

  const handleChange = e => {
    setUserMessage(e.target.value);
  };

  const handleFollowUpClick = (messageId, followUpQuestion) => {
    removeFollowUpQuestionsFromMessage(messageId);
    postMessage(followUpQuestion);
  };

  useEffect(() => {
    postMessage('How do I pay my ATD?');
  }, []);

  return (
    <div className="App">
      <GlobalStateContext.Provider value={state}>
        <Header />
        <main>
          <MessageList>
            {state.messages.length > 0 &&
              state.messages.map(({ id, type, text, followUpQuestions }) => (
                <div
                  key={id}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Message type={type}>{text}</Message>
                  {followUpQuestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {followUpQuestions.map(question => (
                        <FollowUpQuestionButton
                          onClick={() => handleFollowUpClick(id, question)}
                        >
                          {question}
                        </FollowUpQuestionButton>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </MessageList>
          <UserInputWrapper>
            <UserInput
              type="text"
              onKeyDown={handleKeyDown}
              value={userMessage}
              onChange={handleChange}
              placeholder="Ask a question"
            />
            <FontAwesomeIcon icon={faArrowRight} size="2x" color="#d73f09" />
          </UserInputWrapper>
        </main>
      </GlobalStateContext.Provider>
    </div>
  );
};

const FollowUpQuestionButton = styled.button`
  outline: none;
  border: none;
  padding: 8px 12px;
  color: #ffffff;
  background-color: #df3709;
  border-radius: 99px;
  &:not(:last-child) {
    margin-right: 16px;
  }
  margin-bottom: 12px;
`;

const MessageList = ({ ...props }) => {
  const state = useContext(GlobalStateContext);
  const messageListEl = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const chat = messageListEl.current;
        chat.scrollTo({ left: 0, top: chat.scrollHeight, behavior: 'smooth' });
      });
    });
  }, [state.messages]);

  return <MessageListWrapper ref={messageListEl} {...props} />;
};

const MessageListWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  /* height: 100%; */
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 76px - 66px);
`;

export default App;
