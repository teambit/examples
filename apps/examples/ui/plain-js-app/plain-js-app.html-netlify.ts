import { HtmlNetlifyOptions } from '@teambit/apps.examples.aspects.html-netlify';

const plainJS: HtmlNetlifyOptions = {
  name: 'plain-js-app',
  entry: [require.resolve('./plain-js-app.app-root')],
};

export default plainJS;
