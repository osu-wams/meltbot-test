import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';
import { Color, fontSize } from '../theme';
import { GlobalStateContext } from '../GlobalState';

const Input = styled.input`
  height: 5.2rem;
  border-radius: 6px;
  border: 1px solid ${Color['neutral-300']};
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

const UserInput = () => {
  const [value, setValue] = useState('');
  const {
    actions: { postMessage }
  } = useContext(GlobalStateContext);

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
      // Send user message
      postMessage(value);

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
          size="3x"
          color={Color['orange-400']}
        />
      </AskQuestionInput>
    </UserInputWrapper>
  );
};

export default UserInput;
