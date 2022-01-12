import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/firebase.hosting'];

export function getAccessToken() {
  // return new Promise(function (resolve, reject) {
  //   var key = require('../../../../../firebase-key.json');
  //   var jwtClient = new google.auth.JWT(
  //     key.client_email,
  //     null,
  //     key.private_key,
  //     SCOPES,
  //     null
  //   );
  //   jwtClient.authorize(function (err, tokens) {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //     resolve(tokens.access_token);
  //   });
  // });
}
