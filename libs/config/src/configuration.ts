export default () => ({
  appName: process.env.APP_NAME,
  port: parseInt(process.env.PORT as string, 10),
});
