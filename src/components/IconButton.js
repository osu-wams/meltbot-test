import styled from 'styled-components';
import { fontSize } from '../theme';

const IconButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: ${fontSize[16]};
  padding: 0.5rem;
`;

export default IconButton;
