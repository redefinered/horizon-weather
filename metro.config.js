const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure Metro is reachable over IPv4. Expo Go on iOS opens exp://127.0.0.1:8081;
// `expo start --localhost` binds IPv6-only and breaks that connection.
config.server = {
  ...config.server,
  host: '127.0.0.1',
};

module.exports = config;
