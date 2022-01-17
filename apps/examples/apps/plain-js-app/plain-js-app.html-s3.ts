import { HtmlOptions } from '@teambit/apps.examples.aspects.html';
import fs from 'fs';

const s3Config = {
  credentialsProfile: 'default',
  bucket: 'my-deploy-bucket-7777',
  region: 'us-east-2',
};

const plainJS: HtmlOptions = {
  name: 'plain-js-app',
  entry: [require.resolve('./plain-js-app.app-root')],
  s3Config,
};

export default plainJS;
