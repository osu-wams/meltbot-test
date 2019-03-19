import React, { useState, useEffect, useReducer } from 'react';
import { LexRuntime, CognitoIdentityCredentials } from 'aws-sdk';
import styled from 'styled-components';
import generateId from 'uuid/v4';
import './App.css';
import Header from './components/Header';
import Message from './components/Message';
import Input from './components/Input';

var lexRuntime = new LexRuntime({
  apiVersion: '2016-11-28',
  region: 'us-east-1',
  credentials: new CognitoIdentityCredentials(
    { IdentityPoolId: process.env.IDENTITY_POOL_ID },
    { region: process.env.REGION }
  )
});

const initialState = {
  messages: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { messages: [...state.messages, action.message] };
    default:
      throw new Error('AAAAAAAAAA');
  }
};

const actions = {
  ADD_MESSAGE: 'ADD_MESSAGE'
};

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
      postMessage(userMessage);
    }
  };

  const handleChange = e => {
    setUserMessage(e.target.value);
  };

  const handleFollowUpClick = question => {};

  useEffect(() => {
    postMessage('How do I pay my ATD?');
  }, []);

  return (
    <div className="App">
      <Header />
      <MessageList>
        {state.messages.length > 0 &&
          state.messages.map(({ id, type, text, followUpQuestions }) => (
            <div key={id} style={{ display: 'flex', flexDirection: 'column' }}>
              <Message type={type}>{text}</Message>
              {followUpQuestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {followUpQuestions.map(question => (
                    <FollowUpQuestionButton>{question}</FollowUpQuestionButton>
                  ))}
                </div>
              )}
            </div>
          ))}
      </MessageList>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '16px'
        }}
      >
        <Input
          type="text"
          onKeyDown={handleKeyDown}
          value={userMessage}
          onChange={handleChange}
        />
      </div>
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

const MessageList = styled.div`
  height: calc(100% - 76px);
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

// const MessageList = ({ messages }) => (
//   <ul>
//     {messages && messages.map({ message, responseCard }) => (
//       <li>
//         <Message type={message.type}>{message}</Message>
//       </li>
//     )}
//   </ul>
// )

export default App;
