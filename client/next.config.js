// Checks every 300ms file changes
const nextConfig = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  }
};

module.exports = nextConfig;
