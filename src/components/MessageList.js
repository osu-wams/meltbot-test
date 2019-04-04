import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import VisuallyHidden from '@reach/visually-hidden';
import ReactGA from 'react-ga';
import { GlobalStateContext } from '../GlobalState';
import Message from './Message';
import Loader from './Loader';
import FollowUpQuestionButton from './FollowUpQuestionButton';

// Configure links to render in GA-trackable component
const markdownRenderers = {
  link: ({ href, ...props }) => (
    <ReactGA.OutboundLink
      eventLabel={href}
      target="_blank"
      to={href}
      {...props}
    />
  )
};

const MessageListWrapper = styled.main`
  grid-area: log;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 1.6rem 1.6rem 0;
  width: 100%;
  .user {
    text-align: right;
  }
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

    // Log action with GA
    ReactGA.event({
      category: 'UserAction',
      action: 'Clicked follow-up question',
      label: followUpQuestion
    });
  };

  return (
    <MessageListWrapper
      role="log"
      aria-live="assertive"
      ref={messageListEl}
      {...props}
      data-testid="MessageList"
    >
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
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
              <div key={id} className={type === 'user' ? 'user' : ''}>
                <Message type={type}>
                  <VisuallyHidden>
                    {type === 'user' ? 'You said' : 'Benny said'}
                  </VisuallyHidden>
                  <ReactMarkdown
                    source={text}
                    linkTarget="_blank"
                    renderers={markdownRenderers}
                  />
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
                        onClick={() => handleFollowUpClick(question.value)}
                        key={id + index}
                        data-testid="followup-button"
                      >
                        {question.text}
                      </FollowUpQuestionButton>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </MessageListWrapper>
  );
};

export default MessageList;
