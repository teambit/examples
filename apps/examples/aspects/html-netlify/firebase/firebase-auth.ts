import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/firebase.hosting'];

const key = {
  type: 'service_account',
  project_id: 'html-demo-63a45',
  private_key_id: 'c5285da42943c360e7521c2a1c9de71b553f311a',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCgAA3TdkaURIuK\nS1MwvHell9G3Jr6iucx7sgcRzyzBp8gtKR7wsYkAXnnazJfF55xM8PE4i/+un3sI\nKQPHT9yGXgkkEZhprUFvlKhEZugpb1eZO73cnJBweb5bMYI/NuQ17WyJa5c+6ywQ\nSKjxi5IbuFobMmE/eVyfxAYLZFnBa7o7d1wqg6WdGdXzfatnR0dEj4bgfSUPl6s2\ndYJLG+BjYwyINH2oza7g+OaOuqxb80YYE4GO+sUbzP2qsOZe2YNQrK+FGdK0ztb6\nGmT7EAI9kefCgZNEIRAhWy86mVOO49lOBvN+/310auaX8GfpBTTxWOmnHZKPUUBu\nh9dtGo9DAgMBAAECggEAIDTik5ZTTrUdgZD4Be9qBiMxS7S42vibeKq1UZhqYfDs\nEmscl0alVTWvQaO9SVD93V8Cr2c+6F+h3FqlMBGbSlDTdjc0ftEpQtShqmMsiGqp\nL2cfKLE7Qei/sIuetCrQdSp9lovZvgiIrh5yI2z81Cefu6nAeY5sXpyOuuxQROag\nytymYNEaLqJVeqYzQuAvUpN7AqO+cgn1lJ30DWmhzkDyy6TpPdsCpSN+qEqp/j7l\nHHdRPOkj30tSoJYh0eXd0A5cM2CJtJ3JEm+ETuFyxNGTAkY+RQjGHGO3820MvvhM\ncY9PmeBljo98UhG/1IZ0hdaONQ2nBt7MeWAZWz6kQQKBgQDXdlkpP3E9OPbOPTOc\nxbEPVQ9mWF8Noy09IzL7/a74BD/udE17eCCio9p0WNojZVSRr3NdtMtszIgrPD1U\nxw012WmqQvtZjPCCpvPG5I+blkPDugGyZZkVV7x6G99SZY8hPh1ZynvydCNZjjne\nCoUxcgAw/d9VXdPd45eSvCyE/QKBgQC+GmW+OQPpZ8Zshmb5L7mSY+Fbj7+uXYEa\nbOxZrn+1JI5fMRggaMrYYkI79M20uZdX0SzWTXx8oPGStHPVH8yeY56wJmSzbZVo\nqF6Hw30b29lmP5Zg4h7RPJ8WyT6UuNXRLQab2wPJbhh0oltfXYY0AYmzUA6nmqIc\n/UQMRae5PwKBgQDI5Q5JSWAaR2zH64SeHi3zL8pGEQu/uW/K23EESArGMaAyg7pi\n7yTuwHxFkzsBWc+6bq7QpmwuK56jQW2mCFqm5OqC2CVn3+O4zlXqEt5boYXZjytZ\n3SUZI08XQ7m8J/mGc1YGjKd47xSuwc/u2jxKWBMZmvyLqgqLj1Oae12/OQKBgA9e\nLu9ryIcr3nyTeOuYEhZlgKhYPJSp9m/eclTlqGlKZUAIxfyIvC019EjIh4CeqD9v\nJ4LDjNa+ZAkKEXsfMPl08DUpRWbD6xok0k+DXC/OXArKBSwb24Xqsqmy5x46uv5H\n94rN78Zu4gc7wMs60kiN/0XBqQ2fkI9rYf7j+qUdAoGBAK5XoZ2JJVryepM83FBa\n4PUpMXbSLNOFLCCUU1EIO9yBr51MQ6DtwGnEPVZY3uOx2kZYLmHaCLT5SZ+aJ16N\ntnVkZH/A7Xzut1os39QbWjVwQE8x8P35iLsjlXEHL11Ot80KqZrQvC/KG0mqcF2w\n+Zkqt860LVSqOCTuuly7wCLf\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-covts@html-demo-63a45.iam.gserviceaccount.com',
  client_id: '110369181329546408213',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-covts%40html-demo-63a45.iam.gserviceaccount.com',
};

export function getAccessToken(): Promise<string> {
  return new Promise(function (resolve, reject) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      // @ts-ignore
      null,
      key.private_key,
      SCOPES,
      // @ts-ignore
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
