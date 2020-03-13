import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLifeRing, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import '@reach/dialog/styles.css';
import ReactGA from 'react-ga';
import logo from '../assets/logo.png';
import IconButton from './IconButton';
import { Color, fontSize } from '../theme';
import { Dialog, CloseButton } from './Dialog';
import { GlobalStateContext } from '../GlobalState';
import config from '../config';

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
  padding-top: 0.4rem;
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

const Beta = styled.sup`
  font-size: ${fontSize[14]};
  position: relative;
  left: 0.2rem;
  top: -0.4rem;
  font-weight: 700;
  color: ${Color['neutral-600']};
`;

const modalQuestions = [
  { text: 'Advance Tuition Deposit', value: 'I need help with my ATD' },
  { text: 'ONID', value: 'What is an ONID' },
  { text: 'Scholarships', value: 'I need help with my Scholarships' },
  { text: 'Financial Aid', value: 'I need help with Financial Aid' },
  { text: 'Housing', value: 'I need help with Housing' },
  {
    text: 'Immunization requirements',
    value: 'I need help with my Immunization Requirements'
  },
  { text: 'START (orientation)', value: 'What is START' },
  { text: 'Campus visits', value: 'Help with campus visits' }
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
  const [showDialog, setShowDialog] = useState(false);
  const {
    actions: { postMessage }
  } = useContext(GlobalStateContext);

  const handleDialogQuestionClicked = question => {
    postMessage(question);
    setShowDialog(false);

    // Log action with GA
    ReactGA.event({
      category: 'UserAction',
      action: 'Info modal question clicked',
      label: question
    });
  };

  const d = new Date();
  const year = d.getFullYear();

  return (
    <HeaderWrapper>
      <ReactGA.OutboundLink
        to="https://oregonstate.edu"
        eventLabel="https://oregonstate.edu"
        target="_blank"
      >
        <Logo src={logo} alt="Oregon State University" />
      </ReactGA.OutboundLink>
      <IconWrapper>
        <IconButton
          data-testid="about-benny"
          aria-label="About Benny"
          onClick={() => {
            setShowDialog(true);
            ReactGA.modalview('info-modal');
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} color={Color['neutral-600']} />
          About
        </IconButton>
        <HelpLink
          as="a"
          href={config.HELP_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            ReactGA.outboundLink({ label: config.HELP_FORM_URL }, () => {})
          }
        >
          <FontAwesomeIcon icon={faLifeRing} color={Color['orange-400']} />
          Help
        </HelpLink>
      </IconWrapper>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <CloseButton
          data-testid="close-about"
          onClick={() => setShowDialog(false)}
        />

        <h2>
          Chat with Benny<Beta>Beta</Beta>
        </h2>
        <p>
          Hi, I’m Benny!
          <br />I am here to help answer questions for first-year students
          starting at OSU (Corvallis campus) Fall {year}. I’m still learning, so
          if I’m not able to help you, please{' '}
          <a
            href={config.HELP_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              ReactGA.outboundLink({ label: config.HELP_FORM_URL }, () => {})
            }
          >
            contact admissions
          </a>
          .
        </p>
        <ul>
          {modalQuestions.map((question, index) => (
            <li key={index}>
              <QuestionButton
                onClick={() => handleDialogQuestionClicked(question.value)}
              >
                {question.text}
              </QuestionButton>
            </li>
          ))}
        </ul>
      </Dialog>
    </HeaderWrapper>
  );
};

export default Header;
