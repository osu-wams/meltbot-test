import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';
import { Color, fontSize } from '../theme';

const Input = styled.input`
  height: 42px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: none;
  width: 100%;
  font-size: ${fontSize[18]};
  padding: 0 12px;
`;

const UserInputWrapper = styled.div`
  display: flex;
  position: sticky;
  bottom: 0;
  padding: 12px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const AskQuestionInput = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.6rem 1rem;
`;

const UserInput = ({ onMessageEntered }) => {
  const [value, setValue] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (value) {
      // Fire callback to handle message
      onMessageEntered(value);

      // Clear input
      setValue('');
    }
  };

  return (
    <UserInputWrapper>
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Enter a question for Benny"
      />
      <AskQuestionInput onClick={sendMessage} aria-label="Submit your question">
        <FontAwesomeIcon
          icon={faArrowRight}
          size="2x"
          color={Color['orange-400']}
        />
      </AskQuestionInput>
    </UserInputWrapper>
  );
};

export default UserInput;
