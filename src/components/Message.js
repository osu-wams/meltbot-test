import React from "react";
import styled from "styled-components";

const StyledMessage = styled.div`
  background-color: #d73f09;
  border-radius: 16px 16px 0 16px;
  ${props =>
    props.type == "bot"
      ? `
    background-color: #d73f09;
    border-radius: 16px 16px 0 16px;
    align-self: flex-start;
  `
      : `
    background-color: #ffffff;
    border-radius: 16px 16px 16px 0px;
    align-self: flex-start;
  `}
`;

const Message = ({ type, ...props }) => {
  return <StyledMessage type={type} {...props} />;
};

export default Message;
