
/* eslint valid-jsdoc: "off" */

'use strict';

const dotenv = require('dotenv');
dotenv.config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1639623660458_3126';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    iceConfig: {
      accessKeyId: process.env.AccessKeyId || '<your access key>',
      accessKeySecret: process.env.AccessKeySecret || '<your secret key>',
      endpoint: process.env.Endpoint || 'ice.cn-hangzhou.aliyuncs.com',
      regionId: process.env.RegionId || 'cn-hangzhou',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
