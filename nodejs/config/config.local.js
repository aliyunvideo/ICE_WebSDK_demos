'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = {
    security: {
      csrf: {
        enable: false,
        ignoreJSON: true,
      },
      domainWhiteList: [ 'http://localhost:3000' ],
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    static: {
      prefix: '/',
      dir: path.join(appInfo.baseDir, 'fe/build'),
      alias: {
        '/': '/index.html',
        '\\': '\\index.html',
      },
    },
    notfound: {
      pageUrl: '/',
    },
  };

  return config;
};
