import styled from 'styled-components';
import { Color, fontSize } from '../theme';

const spacing = '0.6rem';
const FollowUpQuestionButton = styled.button`
  font-size: ${fontSize[14]};
  outline: none;
  border: none;
  padding: 1.2rem 1.6rem;
  color: #ffffff;
  background-color: ${Color['orange-400']};
  border-radius: 99px;
  text-align: left;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: ${spacing};
  }
  margin-bottom: ${spacing};
  &:hover,
  &:active,
  &:focus {
    background-color: ${Color['neutral-600']};
  }
`;

export default FollowUpQuestionButton;
