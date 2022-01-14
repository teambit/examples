import { google } from 'googleapis';

export function getAccessToken(key: any): Promise<string> {
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
