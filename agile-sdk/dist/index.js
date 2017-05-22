'use strict';

var _protocolManager = require('./protocolManager');

var _protocolManager2 = _interopRequireDefault(_protocolManager);

var _deviceManager = require('./deviceManager');

var _deviceManager2 = _interopRequireDefault(_deviceManager);

var _device = require('./device');

var _device2 = _interopRequireDefault(_device);

var _protocol = require('./protocol');

var _protocol2 = _interopRequireDefault(_protocol);

var _idm = require('./idm');

var _idm2 = _interopRequireDefault(_idm);

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  * @namespace agile
  * @description
  * Welcome to the Agile SDK documentation.
  *
  * This document aims to describe all the functions supported by the SDK, as well as showing examples of their expected usage.
  *
  * If you feel something is missing, not clear or could be improved, please don't hesitate to open an [issue in GitHub](https://github.com/agile-iot/agile-sdk/issues/new), we'll be happy to help.
  * @param {string} - agile-core REST API endpoint
  * @param {string} - agile-idm REST API endpoint
  * @param {string} - agile-idm token
  * @returns {Object}
  * @example
  * var agile = require('agile-sdk')('http://agile-core:8080','zIOycOqbEQh4ayw7lGAm9ILBIr')
*/
var agileSDK = function agileSDK(base, idmBase, token) {
  // parse url to remove any irregularites
  var parsed = (0, _urlParse2.default)(base);
  var apiBase = parsed.origin + '/api';
  var wsBase = parsed.set('protocol', 'ws:').origin + '/ws';
  return {
    /**
    * @namespace protocolManager
    * @memberof agile
    **/
    protocolManager: (0, _protocolManager2.default)(apiBase),
    /**
    * @namespace deviceManager
    * @memberof agile
    **/
    deviceManager: (0, _deviceManager2.default)(apiBase),
    /**
    * @namespace device
    * @memberof agile
    **/
    device: (0, _device2.default)(apiBase, wsBase),
    /**
    * @namespace protocol
    * @memberof agile
    **/
    protocol: (0, _protocol2.default)(apiBase),
    /**
    * @namespace idm
    * @memberof agile
    **/
    idm: (0, _idm2.default)(idmBase, token)
  };
};

module.exports = agileSDK;