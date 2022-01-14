import { google } from 'googleapis';

export function getAccessToken(keyString: string): Promise<string> {
  const key = JSON.parse(keyString);
  const SCOPES = ['https://www.googleapis.com/auth/firebase.hosting'];
  return new Promise(function (resolve, reject) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    // @ts-ignore
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      // @ts-ignore
      resolve(tokens.access_token);
    });
  });
}
