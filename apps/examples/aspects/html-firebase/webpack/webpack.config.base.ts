import { merge } from 'lodash';
import 'style-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { Configuration, IgnorePlugin } from 'webpack';
import * as stylesRegexps from '@teambit/webpack.modules.style-regexps';
import { generateStyleLoaders } from '@teambit/webpack.modules.generate-style-loaders';
import { postCssConfig } from './postcss.config';

const styleLoaderPath = require.resolve('style-loader');

const moduleFileExtensions = ['web.mjs', 'mjs', 'web.js', 'js', 'json', 'md'];

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
// eslint-disable-next-line complexity
export default function (): Configuration {
  const baseStyleLoadersOptions = {
    injectingLoader: styleLoaderPath,
    cssLoaderPath: require.resolve('css-loader'),
    postCssLoaderPath: require.resolve('postcss-loader'),
    postCssConfig,
  };

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  // const env = getClientEnvironment(publicUrlOrPath.slice(0, -1));

  return {
    resolve: {
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: stylesRegexps.cssNoModulesRegex,
              use: generateStyleLoaders(
                merge({}, baseStyleLoadersOptions, {
                  cssLoaderOpts: {
                    importLoaders: 1,
                    sourceMap: false,
                  },
                })
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },

            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs)$/,
              exclude: [/node_modules/, /\/dist\//],
              // consider: limit loader to files only in a capsule that has bitid in package.json
              // descriptionData: { componentId: ComponentID.isValidObject },
              // // or
              // include: capsulePaths
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
              },
            },
            {
              test: stylesRegexps.cssModuleRegex,
              use: generateStyleLoaders(
                merge({}, baseStyleLoadersOptions, {
                  cssLoaderOpts: {
                    importLoaders: 1,
                    modules: {
                      getLocalIdent: getCSSModuleLocalIdent,
                    },
                  },
                })
              ),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
              test: stylesRegexps.sassNoModuleRegex,
              use: generateStyleLoaders(
                merge({}, baseStyleLoadersOptions, {
                  cssLoaderOpts: {
                    importLoaders: 3,
                  },
                  preProcessOptions: {
                    resolveUrlLoaderPath: require.resolve('resolve-url-loader'),
                    preProcessorPath: require.resolve('sass-loader'),
                  },
                })
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: stylesRegexps.sassModuleRegex,
              use: generateStyleLoaders(
                merge({}, baseStyleLoadersOptions, {
                  cssLoaderOpts: {
                    importLoaders: 3,
                    modules: {
                      getLocalIdent: getCSSModuleLocalIdent,
                    },
                  },
                  preProcessOptions: {
                    resolveUrlLoaderPath: require.resolve('resolve-url-loader'),
                    preProcessorPath: require.resolve('sass-loader'),
                  },
                })
              ),
            },
            {
              test: stylesRegexps.lessNoModuleRegex,
              use: generateStyleLoaders(
                merge({}, baseStyleLoadersOptions, {
                  cssLoaderOpts: {
                    importLoaders: 1,
                  },
                  preProcessOptions: {
                    resolveUrlLoaderPath: require.resolve('resolve-url-loader'),
                    preProcessorPath: require.resolve('less-loader'),
                  },
                })
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            {
              test: stylesRegexps.lessModuleRegex,
              use: generateStyleLoaders(
                merge({}, baseStyleLoadersOptions, {
                  cssLoaderOpts: {
                    importLoaders: 1,
                    modules: {
                      getLocalIdent: getCSSModuleLocalIdent,
                    },
                  },
                  preProcessOptions: {
                    resolveUrlLoaderPath: require.resolve('resolve-url-loader'),
                    preProcessorPath: require.resolve('less-loader'),
                  },
                })
              ),
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              // loads svg as both inlineUrl and react component, like:
              // import starUrl, { ReactComponent as StarIcon } from './star.svg';
              // (remove when there is native support for both opitons from webpack5 / svgr)
              test: /\.svg$/,
              oneOf: [
                {
                  dependency: { not: ['url'] }, // exclude new URL calls
                  use: [
                    {
                      loader: require.resolve('@svgr/webpack'),
                      options: { titleProp: true, ref: true },
                    },
                    require.resolve('new-url-loader'),
                  ],
                },
                {
                  type: 'asset', // export a data URI or emit a separate file
                },
              ],
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [
                /\.(js|mjs|jsx)$/,
                /\.html$/,
                /\.mdx?/,
                /\.json$/,
                /\.css$/,
              ],
              type: 'asset',
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "type:asset" loader.
          ],
        },
      ],
    },
    // @ts-ignore
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ].filter(Boolean),
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
}
