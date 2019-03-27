import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { GlobalStateContext } from '../GlobalContext';

const MessageListWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessageList = ({ ...props }) => {
  const { state } = useContext(GlobalStateContext);
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

export default MessageList;
