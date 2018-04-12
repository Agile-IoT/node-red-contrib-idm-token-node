/*******************************************************************************
 *Copyright (C) 2017 FBK, ATOS.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    FBK, ATOS - initial API and implementation
 ******************************************************************************/
var request = require('request');
var lo = require('lodash');
var SDK = require('agile-sdk');
var node_type = "idm-attribute";

module.exports = function(RED) {
    function getAtttribute(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.on('input', function(msg) {
          var idm, entityId, entityType, attribute, destination, token;
          this.log("config:"+JSON.stringify(config))
          var conditions = [
            {cond: (token = msg.token), msg:'msg.token not provided'},
            {cond:(config && config.idm),msg:'idm url not provided in node\'s configuration'},
            {cond:(entityId = msg.entity_id || config.entity_id) ,msg:'entity_id not provided'},
            {cond:(entityType = msg.entity_type || config.entity_type),msg: 'entity_type not provided'},
            {cond:(attribute = msg.attribute || config.attribute),msg: 'attribute not provided'}];
          var errors  = conditions.reduce(
            (accumulator, currentValue, currentIndex, array) => {
              return (!currentValue.cond)? (accumulator + currentValue.msg + ". "):accumulator;
            },
            ""
          );
          if(errors){
            node.warn("errors in node "+node_type+"..."+ errors);
            node.send(msg);
          }
          else{

            var agile = SDK({
              api:"",
              idm:config.idm,
              token:msg.token
            });
            destination = config.destination_property || msg.destination_property;
            agile.idm.entity.get(entityId,entityType).then(function(entity){
              value = lo.get(entity, attribute);
              var dest = destination?destination:"entity_attribute";
              lo.set(msg,dest,value);
              node.send(msg);
            }).catch(function(error){
              node.error("IDM call not successful: "+error);
              node.send(msg);
            });
          }
        });
    };

    RED.nodes.registerType(node_type,getAtttribute, {credentials: {
     clientId: {type:"text"},
     clientSecret: {type:"password"}
    }});
};
