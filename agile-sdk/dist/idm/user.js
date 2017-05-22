'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('../utils');

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var idm = function idm(base, token) {
  base = '' + base;
  return {
    /**
    * @summary Get the user information
    * @name getUserInfo
    * @public
    * @function
    * @memberof agile.idm
    * @fulfil {Object} userInfo - object with user information
    * @returns {Promise}
    * @example
    * agile.id.getuserInfo().then(function(info) {
    *  console.log(info);
    * });
    **/
    getUserInfo: function getUserInfo() {
      return (0, _axios2.default)({
        method: 'GET',
        url: base + '/oauth2/api/userinfo',
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Show information for a particular user
    * @name getuser
    * @public
    * @function
    * @memberof agile.idm.user
    * @param {String} user_name user name
    * @param {String} auth_type authentication type
    * @fulfil {Object} user found
    * @returns {Promise}
    * @example
    * agile.idm.user.getuser("alice","agile-local").then(function(user) {
    *   console.log(user);
    * });
    **/
    getUser: function getUser(user_name, auth_type) {
      var parsed = (0, _urlParse2.default)(base + '/api/v1/user/');
      parsed.set("query", { 'auth_type': auth_type, 'user_name': user_name });
      var url = parsed.toString();
      return (0, _axios2.default)({
        method: 'GET',
        url: url,
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Create user
    * @name createUser
    * @public
    * @function
    * @memberof agile.idm.user
    * @param {String} user_name user name
    * @param {String} auth_type authentication type
    * @param [Object] options continaing  role  of the user as "role" and password as "password"
    * @fulfil {Object} user created
    * @returns {Promise}
    * @example
    * agile.idm.user.createUser('bob','agile-local',{"role":"admin", "password":"secret"}).then(function(user) {
    *   console.log('user created!'+user);
    * });
    **/
    createUser: function createUser(user_name, auth_type, options) {
      var user = {
        "auth_type": auth_type,
        "user_name": user_name
      };
      if (options && options.role) {
        user.role = options.role;
      }
      if (options && options.password) {
        user.password = options.password;
      }
      return (0, _axios2.default)({
        method: 'POST',
        url: base + '/api/v1/user/',
        headers: { "Authorization": 'bearer ' + token },
        data: user
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Delete a user
    * @name deleteUser
    * @public
    * @function
    * @memberof agile.idm.user
    * @param {String} user_name user name
    * @param {String} auth_type authentication type
    * @fulfil {Undefined}
    * @returns {Promise}
    * @example
    * agile.idm.user.deleteUser('bob','agile-local').then(function() {
    *   console.log('user removed!');
    * });
    **/
    deleteUser: function deleteUser(user_name, auth_type) {
      var parsed = (0, _urlParse2.default)(base + '/api/v1/user/');
      parsed.set("query", { 'auth_type': auth_type, 'user_name': user_name });
      var url = parsed.toString();
      return (0, _axios2.default)({
        method: 'DELETE',
        url: url,
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res;
      }).catch(_utils.errorHandler);
    }

  };
};

exports.default = idm;