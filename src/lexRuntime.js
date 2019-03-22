import { LexRuntime, CognitoIdentityCredentials } from "aws-sdk";

let lexRuntime = new LexRuntime({
  apiVersion: "2016-11-28",
  region: process.env.REACT_APP_REGION,
  credentials: new CognitoIdentityCredentials(
    { IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID },
    { region: process.env.REACT_APP_REGION }
  )
});

export default lexRuntime;
