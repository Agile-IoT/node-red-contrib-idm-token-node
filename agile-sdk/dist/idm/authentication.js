'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entity = function entity(base, token) {
  base = '' + base;
  return {
    /**
    * @summary Authenticate a client with client secret and client name. This call only works from server-side JS. See https://github.com/mzabriskie/axios/issues/362
    * @name authenticateClient
    * @public
    * @function
    * @memberof agile.idm.authentication
    * @param {String} client - client name
    * @param {String} secret - client secret
    * @fulfil {Object} Authentication information including token_type and access_token
    * @returns {Promise}
    * @example
    * agile.idm.authentication.authenticateClient("client_name","credentials").then(function(result) {
    *   console.log(credentials.access_token);
    *   console.log(credentials.token_type);
    * });
    **/
    authenticateClient: function authenticateClient(client, secret) {
      var url = base + '/oauth2/token';
      return (0, _axios2.default)({
        method: 'POST',
        url: url,
        auth: {
          username: client,
          password: secret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: _qs2.default.stringify({ grant_type: 'client_credentials' })
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    }
  };
};

exports.default = entity;