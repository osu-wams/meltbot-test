# Meltbot

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). See the CRA documentation for additional details.

Requirements:

- Yarn
- NodeJS >= latest 8.x release

To get started developing with this project:

```
$ git clone git@github.com:osu-wams/meltbot.git && cd meltbot
$ yarn install
$ yarn start
```

Note: The app will not start without additional environment variables. See "Configuration" for details.

## Configuration

Meltbot makes use of some AWS services and is configured to pull AWS connection info from environment variables at build time.

To ensure the project spins up as expected, make sure the following variables are available in your environment (.bashrc, .zshrc, etc):

```
// Dependency Configuration
export FONTAWESOME_TOKEN=-<fontawsome-token>

// AWS Configuration
export REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=<cognito-entity-pool-id>
export REACT_APP_AWS_REGION=<aws-region>
export REACT_APP_AWS_LEX_BOT_NAME=<lex-bot-name>
export REACT_APP_AWS_LEX_BOT_ALIAS=<lex-bot-alias OR $LATEST for development>

// GA Configuration
export REACT_APP_GA_TRACKING_ID=<google-analytics-tracking-id>

// App Configuration
export REACT_APP_HELP_FORM_URL=<help-form-url>
```
