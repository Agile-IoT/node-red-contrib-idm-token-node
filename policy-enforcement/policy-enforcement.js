var request = require('request');
var SDK = require('agile-sdk');

module.exports = function(RED) {
    function TokenExtractNode(config) {
        RED.nodes.createNode(this,config);
         var node = this;
         this.on('input', function(msg) {
           
           var agile = SDK({
             api:"",
             idm:config.pdp,
             token:msg.token
           });
           var r = {
             entityId : config.entityId,
             entityType: config.entityType,
             field : config.action,
             method : config.operation
           }

           agile.policies.pdp.evaluate([r]).then(function(res) {
              console.log("req for the pdp "+JSON.stringify(r));
              console.log("result from pdp "+JSON.stringify(res));
              if(res[0]){
                node.send(msg);
              } else if(config.forwardEmptyMessage){
                node.send({});
              } else {
                console.log('forbidden message by policy');
              }

           }).catch(function(error) {
             console.log("error from pdp "+error);
             if(config.forwardEmptyMessage){
               node.send({});
             }
             else {
               console.log('forbidden message by policy');
             }

           })

        });
    }

    RED.nodes.registerType("policy-enforcement",TokenExtractNode);
};
