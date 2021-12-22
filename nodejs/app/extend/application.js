'use strict';
const Client = require('@alicloud/ice20201109').default;
const ICE = Symbol('ice-client');

module.exports = {
  get iceClient() {
    if (!this[ICE]) {
      this[ICE] = new Client(this.config.iceConfig);
    }
    return this[ICE];
  },
};
