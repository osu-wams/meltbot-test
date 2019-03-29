import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import VisuallyHidden from '@reach/visually-hidden';
import { GlobalStateContext } from '../GlobalState';
import Message from './Message';
import Loader from './Loader';
import FollowUpQuestionButton from './FollowUpQuestionButton';

const MessageListWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessageList = ({ ...props }) => {
  const {
    state,
    actions: { postMessage }
  } = useContext(GlobalStateContext);
  const messageListEl = useRef(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const chat = messageListEl.current;
        if (chat) {
          chat.scrollTo({
            left: 0,
            top: chat.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    });
  }, [state.messages]);

  const handleFollowUpClick = async followUpQuestion => {
    // Send clicked question to Lex
    postMessage(followUpQuestion);
  };

  return (
    <MessageListWrapper
      ref={messageListEl}
      {...props}
      data-testid="MessageList"
    >
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
                  <VisuallyHidden>Suggested followup questions:</VisuallyHidden>
                  {followUpQuestions.map((question, index) => (
                    <FollowUpQuestionButton
                      onClick={() => handleFollowUpClick(question)}
                      key={id + index}
                      tabIndex="10"
                      data-testid="followup-button"
                    >
                      {question}
                    </FollowUpQuestionButton>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </MessageListWrapper>
  );
};

export default MessageList;
