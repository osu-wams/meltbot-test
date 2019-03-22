import { LexRuntime, CognitoIdentityCredentials } from 'aws-sdk';
import generateId from 'uuid/v4';

let lexRuntime = new LexRuntime({
  apiVersion: '2016-11-28',
  region: process.env.REACT_APP_REGION,
  credentials: new CognitoIdentityCredentials(
    { IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID },
    { region: process.env.REACT_APP_REGION }
  )
});

const createMessage = ({ type = 'user', text, followUpQuestions = [] }) => ({
  id: generateId(),
  type,
  text,
  followUpQuestions
});

export { createMessage, lexRuntime };
