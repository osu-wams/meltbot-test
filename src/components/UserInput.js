import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';
import { Color } from '../theme';

const Input = styled.input`
  height: 42px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: none;
  width: 100%;
  font-size: 18px;
  padding: 0 12px;
  margin-right: 12px;
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

const UserInput = ({ onMessageEntered }) => {
  const [value, setValue] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      // Fire callback to handle message
      onMessageEntered(value);

      // Clear input
      setValue('');
    }
  };

  return (
    <UserInputWrapper>
      <Input value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
      <FontAwesomeIcon
        icon={faArrowRight}
        size="2x"
        color={Color['orange-400']}
      />
    </UserInputWrapper>
  );
};

export default UserInput;
