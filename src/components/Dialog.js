import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog as ReachDialog } from '@reach/dialog';
import { faTimesCircle } from '@fortawesome/pro-light-svg-icons';
import benny from '../assets/benny.png';
import VisuallyHidden from '@reach/visually-hidden';
import { fontSize, Color } from '../theme';
import IconButton from './IconButton';

const CloseButton = ({ ...props }) => (
  <IconButton type="cancel" {...props}>
    <FontAwesomeIcon
      icon={faTimesCircle}
      size="2x"
      color={Color['neutral-500']}
    />
    <VisuallyHidden>Close</VisuallyHidden>
  </IconButton>
);

const Dialog = styled(ReachDialog)`
  [type='cancel'] {
    float: right;
    margin-right: -1rem;
    font-size: 2rem;
  }
  h2 {
    color: ${Color['orange-400']};
    display: flex;
    align-items: center;
    height: 5rem;
    font-size: ${fontSize[24]};
    font-weight: 500;
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 60px;
    background: url(${benny}) center left no-repeat;
  }
  @media screen and (max-width: 767px) {
    &[data-reach-dialog-content] {
      height: 100vh;
      width: 100%;
      margin: 0;
    }
  }
  @media (min-width: 768px) {
    border-radius: 8px;
    [type='cancel'] {
      margin-top: -1rem;
    }
    &[data-reach-dialog-content] {
      width: 60vw;
      max-width: 768px;
    }
  }
`;

const DialogFooter = styled.div`
  margin: 2.5rem 0 0;
  display: flex;
  a {
    margin-left: auto;
  }
`;

export { Dialog, DialogFooter, CloseButton };
