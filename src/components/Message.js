import React from 'react';
import styled from 'styled-components';
import { Color } from '../theme';
import benny from '../assets/benny.png';

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
        position: relative;
        margin-left: 60px;
        margin-bottom: 30px;
        border: 1px solid ${Color['neutral-400']};
        &:before {
          content: ' ';
          background: url(${benny});
          width: 50px;
          height: 50px;
          position: absolute;
          left: -60px;
          bottom: -20px;
        }
      `;
    }
    if (props.type === 'user') {
      return `
        align-self: flex-end;
        border-radius: 16px 16px 0 16px;
        color: #ffffff;
      `;
    }
  }}
`;

const Message = ({ type, ...props }) => {
  return <StyledMessage type={type} {...props} />;
};

export default Message;
