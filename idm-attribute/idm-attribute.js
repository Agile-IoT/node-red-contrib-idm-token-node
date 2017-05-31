var request = require('request');
var lo = require('lodash');
var SDK = require('agile-sdk');
var node_type = "idm-attribute";

module.exports = function(RED) {
    function getAtttribute(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.on('input', function(msg) {

          var conditions = [{cond:msg.token, msg:'msg.token not provided'}, {cond:(config && config.idm),msg:'idm url not provided in node\'s configuration'},{cond:msg.entity_id,msg:'msg.entity_id not provided'},{cond: msg.entity_type,msg: 'msg.entity_type not provided'},{cond: msg.attribute,msg: 'msg.attribute not provided'}];
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
            agile.idm.entity.get(msg.entity_id,msg.entity_type).then(function(entity){
              value = lo.get(entity,msg.attribute);
              var dest = msg.destination_property?msg.destination_property:"entity_attribute";
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
