'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var group = function group(base, token) {
  base = '' + base;
  return {
    /**
    * @summary List all groups
    * @name getGroups
    * @public
    * @function
    * @memberof agile.idm
    * @fulfil {Array} all groups
    * @returns {Promise}
    * @example
    * agile.idm.getGroups().then(function(groups) {
    *   console.log(groups);
    * });
    **/
    getGroups: function getGroups() {
      var url = base + '/api/v1/group';
      return (0, _axios2.default)({
        method: 'GET',
        url: url,
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Create a group onwned by the authenticated user
    * @name createGroup
    * @public
    * @function
    * @memberof agile.idm
    * @param {String} groupName - Name of the group
    * @fulfil {Object} group created
    * @returns {Promise}
    * @example
    * agile.device.createGroup('ble-devices').then(function(group) {
    *   console.log('group created!'+group);
    * });
    **/
    createGroup: function createGroup(name) {
      return (0, _axios2.default)({
        method: 'POST',
        url: base + '/api/v1/group/',
        headers: { "Authorization": 'bearer ' + token },
        data: { "group_name": name }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Delete a group
    * @name deleteGroup
    * @public
    * @function
    * @memberof agile.idm
    * @param {String} owner - Owner of the group
    * @param {String} groupName - Name of the group
    * @fulfil {Undefined}
    * @returns {Promise}
    * @example
    * agile.idm.deleteGroup('agile!@!agile-local','my-group').then(function() {
    *   console.log('group removed!');
    * });
    **/
    deleteGroup: function deleteGroup(owner, name) {
      return (0, _axios2.default)({
        method: 'DELETE',
        url: base + '/api/v1/user/' + owner + '/group/' + name,
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Add entity to a group
    * @name addEntityToGroup
    * @public
    * @function
    * @memberof agile.idm
    * @param {String} owner - Owner of the group
    * @param {String} groupName - Name of the group
    * @param {String} entityId - id of the entity
    * @param {String} entityType - Type of the entity
    * @fulfil {Undefined}
    * @returns {Promise}
    * @example
    * agile.idm.addEntityToGroup('agile!@!agile-local','my-group','1','/sensor').then(function(updated) {
    *   console.log('entity updated !'+updated);
    * });
    **/
    addEntityToGroup: function addEntityToGroup(owner, name, entity_id, entity_type) {
      return (0, _axios2.default)({
        method: 'POST',
        url: base + '/api/v1/user/' + owner + '/group/' + name + '/entities/' + entity_type + '/' + entity_id,
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    },
    /**
    * @summary Remove entity from a group
    * @name removeEntityFromGroup
    * @public
    * @function
    * @memberof agile.idm
    * @param {String} owner - Owner of the group
    * @param {String} groupName - Name of the group
    * @param {String} entityId - id of the entity
    * @param {String} entityType - Type of the entity
    * @fulfil {Undefined}
    * @returns {Promise}
    * @example
    * agile.idm.removeEntityFromGroup('agile!@!agile-local','my-group','1','/sensor').then(function(updated) {
    *   console.log('entity updated !'+updated);
    * });
    **/
    removeEntityFromGroup: function removeEntityFromGroup(owner, name, entity_id, entity_type) {
      return (0, _axios2.default)({
        method: 'DELETE',
        url: base + '/api/v1/user/' + owner + '/group/' + name + '/entities/' + entity_type + '/' + entity_id,
        headers: { "Authorization": 'bearer ' + token }
      }).then(function (res) {
        return res.data;
      }).catch(_utils.errorHandler);
    }
  };
};

exports.default = group;