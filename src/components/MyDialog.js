import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@reach/dialog';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import VisuallyHidden from '@reach/visually-hidden';
import { fontSize, Color } from '../theme';
import IconButton from './IconButton';

const CloseButton = ({ ...props }) => (
  <IconButton type="cancel" {...props}>
    <FontAwesomeIcon icon={faTimes} size="2x" />
    <VisuallyHidden>Close</VisuallyHidden>
  </IconButton>
);

const MyDialog = styled(Dialog)`
  border-radius: 4px;
  [type='cancel'] {
    float: right;
    margin-right: -2rem;
  }
  h2 {
    color: ${Color['orange-400']};
    font-size: ${fontSize[24]};
    font-weight: 500;
    margin-bottom: 0;
    margin-top: 0.5rem;
  }
  h3 {
    font-size: ${fontSize[16]};
    color: ${Color['neutral-200']};
    margin-bottom: 0.5rem;
  }
  .details {
    color: ${Color['neutral-600']};
    font-size: ${fontSize[14]};
    margin-top: -1rem;
    margin-bottom: 2rem;
  }
  @media screen and (max-width: 767px) {
    &[data-reach-dialog-content] {
      width: 92%;
      margin: 2rem auto;
      padding-top: 0.5rem;
    }
  }
  @media (min-width: 768px) {
    &[data-reach-dialog-content] {
      width: 60vw;
      max-width: 768px;
    }
  }
`;

const MyDialogFooter = styled.div`
  margin: 2.5rem 0 0;
  display: flex;
  a {
    margin-left: auto;
  }
`;

export { MyDialogFooter, CloseButton };
export default MyDialog;
