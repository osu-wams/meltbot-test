import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faQuestionCircle } from '@fortawesome/pro-light-svg-icons';
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/dialog/styles.css';
import logo from '../assets/logo.png';
import IconButton from './IconButton';
import { Color } from '../theme';
import MyDialog, { CloseButton } from './MyDialog';
import { GlobalStateContext } from '../GlobalState';

const HeaderWrapper = styled.div`
  grid-area: header;
  border-bottom: 1px solid ${Color['neutral-200']};
  display: flex;
  width: 100%;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  z-index: 1;
  a + svg {
    margin-left: 12px;
  }
`;

const Logo = styled.img`
  height: 44px;
  width: 140px;
`;

const modalQuestions = [
  'Advance Tuition Deposit',
  'ONID',
  'Scholarships',
  'Financial Aid',
  'Housing',
  'Immunization requirements',
  'START (orientation)',
  'Campus visits',
  'Welcome Week',
  'Contact information'
];

const QuestionButton = styled.button`
  outline: none;
  background: none;
  border: none;
  color: #069;
  text-decoration: underline;
  cursor: pointer;
  &:focus {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const {
    actions: { postMessage }
  } = useContext(GlobalStateContext);

  const handleDialogQuestionClicked = question => {
    postMessage(question);
    setOpen(false);
  };

  return (
    <HeaderWrapper>
      <a href="https://oregonstate.edu" rel="noopener noreferrrer">
        <Logo src={logo} alt="Oregon State University" />
      </a>
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
        <IconButton
          data-testid="about-benny"
          aria-label="About Benny"
          onClick={() => setOpen(!isOpen)}
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            size="2x"
            color={Color['neutral-600']}
          />
        </IconButton>
      </div>
      <MyDialog isOpen={isOpen}>
        <CloseButton
          data-testid="close-about"
          onClick={() => setOpen(!isOpen)}
        />

        <h2>Hi, I’m Benny!</h2>
        <p>
          I am here to help answer questions for first-year students starting at
          OSU (Corvallis campus) Fall 2019. How can I help?
        </p>
        <ul>
          {modalQuestions.map((question, index) => (
            <li key={index}>
              <QuestionButton
                onClick={() => handleDialogQuestionClicked(question)}
              >
                {question}
              </QuestionButton>
            </li>
          ))}
        </ul>
      </MyDialog>
    </HeaderWrapper>
  );
};

export default Header;
