import React, { useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLifeRing, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import '@reach/dialog/styles.css';
import logo from '../assets/logo.png';
import IconButton from './IconButton';
import { Color, fontSize } from '../theme';
import { Dialog, CloseButton } from './Dialog';
import { GlobalStateContext } from '../GlobalState';
import toggleAbout from '../hooks/toggleAbout';

const HeaderWrapper = styled.div`
  grid-area: header;
  border-bottom: 1px solid ${Color['neutral-200']};
  display: flex;
  width: 100%;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
`;

const IconWrapper = styled.div`
  display: flex;
  width: 12rem;
  justify-content: space-between;
  font-size: ${fontSize[14]};
  svg {
    font-size: ${fontSize[24]};
  }
`;

const HelpLink = styled(IconButton)`
  text-decoration: none;
`;

const Logo = styled.img`
  height: auto;
  width: 170px;
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
  'Welcome Week'
];

const QuestionButton = styled.button`
  outline: none;
  background: none;
  border: none;
  color: ${Color['orange-400']};
  font-size: ${fontSize[16]};
  text-decoration: underline;
  padding: 0.8rem;
  cursor: pointer;
  text-align: left;
  &:focus {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

const Header = () => {
  const { isOpen, toggle } = toggleAbout();
  const {
    actions: { postMessage }
  } = useContext(GlobalStateContext);

  const handleDialogQuestionClicked = question => {
    postMessage(question);
    toggle();
  };

  return (
    <HeaderWrapper>
      <a href="https://oregonstate.edu" rel="noopener noreferrrer">
        <Logo src={logo} alt="Oregon State University" />
      </a>
      <IconWrapper>
        <IconButton
          data-testid="about-benny"
          aria-label="About Benny"
          onClick={() => toggle()}
        >
          <FontAwesomeIcon icon={faInfoCircle} color={Color['neutral-600']} />
          About
        </IconButton>
        <HelpLink
          as="a"
          href="#CHANGE_ME_QUALTRIX"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLifeRing} color={Color['orange-400']} />
          Help
        </HelpLink>
      </IconWrapper>
      <Dialog isOpen={isOpen}>
        <CloseButton data-testid="close-about" onClick={() => toggle()} />

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
      </Dialog>
    </HeaderWrapper>
  );
};

export default Header;
