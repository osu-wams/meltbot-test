import styled from "styled-components";
import { Color } from "../theme";

const FollowUpQuestionButton = styled.button`
  outline: none;
  border: none;
  padding: 8px 12px;
  color: #ffffff;
  background-color: ${Color["orange-400"]};
  border-radius: 99px;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 16px;
  }
  margin-bottom: 12px;
  &:hover,
  &:active,
  &:focus {
    background-color: ${Color["neutral-600"]};
  }
`;

export default FollowUpQuestionButton;
