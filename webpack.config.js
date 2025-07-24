const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const path = require('path');

module.exports = {
  // ... other options
  devtool: 'source-map', // Source map generation must be turned on
  output: {
    path: path.resolve(__dirname, 'dist/apps/api'), // include 경로와 일치해야함
    filename: '[name].js',
    devtoolModuleFilenameTemplate: info =>
      `app:///${path.relative(__dirname, info.resourcePath).replace(/\\/g, '/')}`,
  },
  plugins: [
    // Put the Sentry Webpack plugin after all other plugins
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'no-iq5',
      project: 'boiler-plate',

      include: path.resolve(__dirname, 'dist/apps/api'), // 업로드할 파일들이 실제로 있는 디렉터리
      urlPrefix: 'app:///',
      rewrite: true,
      sourcemaps: {
        filesToDeleteAfterUpload: ['**/*.map'],
      },
    }),
  ],
};
