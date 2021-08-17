const environments = {
  DEV: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'DEV',
  },
  HMLG: {
    httpPort: 4000,
    httpsPort: 4001,
    envName: 'HMLG',
  },
  PROD: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'PROD',
  },
};

const selectedEnv = typeof (process.env.NODE_ENV) == 'string'
  ? process.env.NODE_ENV.toUpperCase()
  : '';

module.exports = typeof (environments[selectedEnv]) == 'object'
  ? environments[selectedEnv]
  : environments.DEV;
