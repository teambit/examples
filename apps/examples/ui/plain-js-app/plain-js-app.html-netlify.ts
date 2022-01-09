import { HtmlNetlifyOptions } from '@teambit/apps.examples.aspects.html-netlify';
// import path from 'path';

// const PATH = require.resolve('./plain-js-app.app-root');
// const NEW_PATH = PATH.replace(`${path.sep}dist`, '');

const plainJS: HtmlNetlifyOptions = {
  name: 'plain-js-app',
  entry: [require.resolve('./plain-js-app.app-root')],
};

export default plainJS;
