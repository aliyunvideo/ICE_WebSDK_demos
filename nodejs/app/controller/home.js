'use strict';

const Controller = require('egg').Controller;
const Util = require('@alicloud/tea-util');
const OpenApi = require('@alicloud/openapi-client');

class HomeController extends Controller {
  async requestICEPost() {
    const { ctx } = this;
    const { Action, ...params } = ctx.request.body;
    const runtime = new Util.RuntimeOptions({});
    const req = new OpenApi.OpenApiRequest({
      body: Util.default.toMap(params),
    });
    const result = await this.app.iceClient.doRPCRequest(
      Action,
      '2020-11-09',
      'HTTPS',
      'POST',
      'AK',
      'json',
      req,
      runtime
    );
    ctx.body = result.body;
  }

  async requestICEGet() {
    const { ctx } = this;
    const { Action, ...params } = ctx.request.query;
    const runtime = new Util.RuntimeOptions({});
    const req = new OpenApi.OpenApiRequest({
      query: Util.default.toMap(params),
    });
    const result = await this.app.iceClient.doRPCRequest(
      Action,
      '2020-11-09',
      'HTTPS',
      'GET',
      'AK',
      'json',
      req,
      runtime
    );
    ctx.body = result.body;
  }

}

module.exports = HomeController;
