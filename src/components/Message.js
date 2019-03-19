import React from 'react';
import styled from 'styled-components';

const StyledMessage = styled.div`
  max-width: 80%;
  background-color: #d73f09;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
  ${props => {
    if (props.type === 'bot') {
      return `
    background-color: #ffffff;
    border-radius: 16px 16px 16px 0;
    align-self: flex-start;
  `;
    }
    if (props.type === 'user') {
      return `
    border-radius: 16px 16px 0 16px;
    align-self: flex-end;
    color: #ffffff;
  `;
    }
  }}
`;

const Message = ({ type, ...props }) => {
  return <StyledMessage type={type} {...props} />;
};

export default Message;
