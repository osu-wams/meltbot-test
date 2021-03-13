const configs = {
  // AWS Configuration (Lex, Cognito)
  AWS_REGION: process.env.REACT_APP_AWS_REGION,
  AWS_COGNITO_IDENTITY_POOL_ID:
    process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  AWS_LEX_BOT_NAME: process.env.REACT_APP_AWS_LEX_BOT_NAME,
  AWS_LEX_BOT_ALIAS: process.env.REACT_APP_AWS_LEX_BOT_ALIAS,
  // Google Analytics Configuration
  GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID,
  // App Help/Feedback Form URL
  HELP_FORM_URL: process.env.REACT_APP_HELP_FORM_URL
};
export default configs;
