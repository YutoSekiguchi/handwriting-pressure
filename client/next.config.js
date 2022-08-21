/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

dotenv.config();

const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  nextConfig,
  env: {
    API_URL: IS_PRODUCTION ? process.env.API_URL_PROD : process.env.API_URL_DEV,
  },
};
