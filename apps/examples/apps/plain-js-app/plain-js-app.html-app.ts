import { HtmlOptions } from '@teambit/apps.examples.aspects.html';
import { FirebaseDeploy } from '@teambit/apps.examples.modules.firebase-deploy';
import fs from 'fs';

const KEY = fs.readFileSync(
  '/Users/eden/Documents/Projects/examples/apps/examples/apps/plain-js-app/firebase-key.json',
  'utf-8'
);

const SITE_ID = 'html-demo-63a45';

const firebaseDeploy = new FirebaseDeploy(KEY, SITE_ID);

const plainJS: HtmlOptions = {
  name: 'plain-js-app',
  entry: [require.resolve('./plain-js-app.app-root')],
  deploy: firebaseDeploy.deploy.bind(firebaseDeploy),
};

export default plainJS;
