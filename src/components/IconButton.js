import styled from 'styled-components';
import { fontSize, Color } from '../theme';

const IconButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: ${fontSize[14]};
  color: ${Color['neutral-700']};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 2.2rem;
`;

export default IconButton;
