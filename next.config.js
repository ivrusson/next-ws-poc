const path = require('path');

module.exports = {
  output: 'standalone',
  // distDir: 'build',
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['~'] = path.resolve(__dirname, 'src');

    return config;
  }
};
