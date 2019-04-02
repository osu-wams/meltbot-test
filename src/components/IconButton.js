import styled from 'styled-components';
import { fontSize, Color } from '../theme';

const IconButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: ${fontSize[16]};
  color: ${Color['neutral-700']};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 3rem;
`;

export default IconButton;
