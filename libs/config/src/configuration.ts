export default () => ({
  appName: process.env.APP_NAME || 'boilerplate',
  port: parseInt(process.env.PORT as string, 10) || 3000,
});
