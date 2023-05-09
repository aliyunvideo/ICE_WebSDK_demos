'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/openApiPost', controller.home.requestICEPost);
  router.get('/openApi', controller.home.requestICEGet);
};
