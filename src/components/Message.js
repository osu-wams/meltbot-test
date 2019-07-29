import React from 'react';
import styled from 'styled-components';
import { Color } from '../theme';
import benny from '../assets/benny.png';

const StyledMessage = styled.div`
  display: inline-block;
  max-width: 70%;
  background-color: #d73f09;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
  text-align: left;
  /* Break long email addresses */
  a[href^='mailto:'] {
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }
  /* Remove top margin for first <p> element after VisuallyHiddem */
  & > span + p,
  & > div + p {
    margin-top: 0;
  }
  & > :last-child {
    margin-bottom: 0;
  }
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
          background: url(${benny}) no-repeat center center;
          width: 50px;
          height: 50px;
          position: absolute;
          left: -60px;
          bottom: -20px;
        }
        a {
          color: ${Color['orange-400']}
        }
      `;
    }
    if (props.type === 'user') {
      return `
        right: 0;
        border-radius: 16px 16px 0 16px;
        color: #ffffff;
      `;
    }
  }}
`;

const Message = ({ type, ...props }) => {
  return <StyledMessage type={type} {...props} data-testid="message" />;
};

export default Message;
