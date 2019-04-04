import { LexRuntime, CognitoIdentityCredentials } from 'aws-sdk';
import generateId from 'uuid/v4';
import config from './config';

let lexRuntime = new LexRuntime({
  apiVersion: '2016-11-28',
  region: config.AWS_REGION,
  credentials: new CognitoIdentityCredentials(
    { IdentityPoolId: config.AWS_COGNITO_IDENTITY_POOL_ID },
    { region: config.AWS_REGION }
  )
});

const createMessage = ({
  type = 'user',
  text = '',
  followUpQuestions = []
} = {}) => ({
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
      botName: config.AWS_LEX_BOT_NAME,
      botAlias: config.AWS_LEX_BOT_ALIAS,
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
          e => ({ text: e.text, value: e.value })
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
