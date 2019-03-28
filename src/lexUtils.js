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

const postMessage = messageText => {
  if (!messageText) {
    Promise.reject('No message text supplied');
  }

  // Post user message to Lex
  return lexRuntime
    .postText({
      botName: process.env.REACT_APP_BOT_NAME,
      botAlias: process.env.REACT_APP_BOT_ALIAS,
      userId: `lex-web-ui-${Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)}`,
      inputText: messageText
    })
    .promise()
    .then(data => {
      // Get markdown-formatted message if supplied
      let markdownMessage;
      if (data.sessionAttributes && data.sessionAttributes.appContext) {
        let appContext = JSON.parse(data.sessionAttributes.appContext);
        if (appContext.altMessages && appContext.altMessages.markdown) {
          markdownMessage = appContext.altMessages.markdown;
        }
      }

      // Get follow-up question prompts
      let followUpQuestions = [];
      if (
        data.responseCard &&
        data.responseCard.genericAttachments &&
        data.responseCard.genericAttachments.length
      ) {
        followUpQuestions = data.responseCard.genericAttachments[0].buttons.map(
          e => e.text
        );
      }

      // Construct message from response data
      const botResponse = createMessage({
        type: 'bot',
        text: markdownMessage ? markdownMessage : data.message,
        followUpQuestions
      });

      return botResponse;
    });
};

export { createMessage, lexRuntime, postMessage };
