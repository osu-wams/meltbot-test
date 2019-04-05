import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Color } from '../theme';

const LoadingAnimation = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${Color['neutral-600']};
  border-radius: 100%;
  display: inline-block;
  animation: ${LoadingAnimation} 1.4s infinite ease-in-out both;
  margin-right: 6px;
`;

const Dot1 = styled(Dot)`
  animation-delay: -0.4s;
`;

const Dot2 = styled(Dot)`
  animation-delay: -0.2s;
`;

const Loader = () => {
  return (
    <div style={{ display: 'inline' }}>
      <Dot1 />
      <Dot2 />
      <Dot />
    </div>
  );
};

export default Loader;
