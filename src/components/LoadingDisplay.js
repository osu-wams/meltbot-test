import React, { useContext } from 'react';
import styled from 'styled-components';
import { GlobalStateContext } from '../GlobalState';
import { breakpoints, Color } from '../theme';
import LoadingAnimation from './LoadingAnimation';

const LoadingDisplay = () => {
  const {
    state: { loading }
  } = useContext(GlobalStateContext);

  if (loading) {
    return (
      <LoadingDisplayWrapper>
        <LoadingAnimation />
        <b>Benny</b>
        {'is typing'}
      </LoadingDisplayWrapper>
    );
  }

  return null;
};

const LoadingDisplayWrapper = styled.div`
  color: ${Color['neutral-600']};
  grid-area: loading;
  text-align: left;
  width: 100%;
  padding-left: 16px;
  @media (min-width: ${breakpoints[768]}) {
    margin: 0 auto;
    max-width: 768px;
  }
  & > b {
    margin-right: 6px;
  }
`;

export default LoadingDisplay;
