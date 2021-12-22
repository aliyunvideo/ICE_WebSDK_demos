/* eslint valid-jsdoc: "off" */

'use strict';

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
      accessKeyId: '<your access key>',
      accessKeySecret: '<your secret key>',
      endpoint: 'ice.cn-hangzhou.aliyuncs.com',
      regionId: 'cn-hangzhou',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
