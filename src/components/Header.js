import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faQuestionCircle } from '@fortawesome/pro-light-svg-icons';
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/dialog/styles.css';
import logo from '../assets/logo.png';
import IconButton from './IconButton';
import { Color } from '../theme';
import MyDialog, { CloseButton } from './MyDialog';

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 76px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  a + svg {
    margin-left: 12px;
  }
`;

const Logo = styled.img`
  height: 44px;
  width: 140px;
`;

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <HeaderWrapper>
      <Logo src={logo} alt="Oregon State University" />
      <div>
        <a
          href="https://search.oregonstate.edu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            color={Color['neutral-600']}
          />
          <VisuallyHidden>Search Oregon State University</VisuallyHidden>
        </a>
        <IconButton aria-label="About Benny" onClick={() => setOpen(!isOpen)}>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            size="2x"
            color={Color['neutral-600']}
          />
        </IconButton>
      </div>
      <MyDialog isOpen={isOpen}>
        <CloseButton onClick={() => setOpen(!isOpen)} />
        <h2>Hi, I’m Benny! </h2>
        <p>
          I am here to help answer questions for first-year students starting at
          OSU (Corvallis campus) Fall 2019. How can I help?
        </p>
        <ul>
          <li>Advance Tuition Deposit</li>
          <li>ONID</li>
          <li>Scholarships</li>
          <li>Financial Aid</li>
          <li>Housing</li>
          <li>Immunization requirements</li>
          <li>START (orientation)</li>
          <li>Campus visits</li>
          <li>Welcome Week</li>
          <li>Contact information</li>
        </ul>
      </MyDialog>
    </HeaderWrapper>
  );
};

export default Header;
