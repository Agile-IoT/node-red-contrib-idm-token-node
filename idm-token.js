/*
 This function checks the object, and verifies if it looks like an http request.
 If so, it will return the bearer token in the authorization header if any,
*/
function extractTokenFromRequest(req){
  return new Promise(function(resolve,reject){
    if(req && req.headers && req.headers.authorization){
      var auths = req.headers.authorization.split(",");
      auths.forEach(function(value){
        console.log(JSON.stringify(value));
        value = value.trim();
        if(value.toLowerCase().startsWith("bearer")){
          var split = value.split(" ");
          return resolve(split[split.length-1].trim());
        }
      })
    } else{
      return reject("token not found in the request");
    }
  });
}


function extractTokenFromContext(node){
  return new Promise(function(resolve,reject){
    if(node.context().get("token")){
      return resolve(node.context().get("token"));
    }
    else if(node.credentials.clientId && node.credentials.clientSecret ){
      // in the fugure this should replace the string by the actual token from IDM
      var token = node.credentials.clientId+"-"+node.credentials.clientSecret+"-"+Math.random();
      node.context().set("token", token);
      return resolve(token);
    } else{
      console.log(JSON.stringify("credentials"+JSON.stringify(node.credentials)));
      return reject("credentials for the  node are not set");
    }
  });
}

module.exports = function(RED) {
    function TokenExtractNode(config) {
        RED.nodes.createNode(this,config);
         var node = this;
        this.on('input', function(msg) {
          this.log("token source selected for idm-token "+JSON.stringify(config));
          if(config.tokensource && config.tokensource === "header"){
            extractTokenFromRequest(msg.req).then(function(token){
                msg.token = token;
                node.send(msg);
            }).catch(function(error){
                node.error("something went wrong when getting token: " + error,msg);
                node.send(msg);
            });
          }
          else if(config.tokensource && config.tokensource === "session"){

            extractTokenFromContext(node).then(function(token){
              msg.token = token;
              node.send(msg);
            }).catch(function(error){
              node.error("something went wrong when getting token: " + error,msg);
              node.send(msg);
            });
           }
           //TODO in the future
           //TODO else if config.tokensource === "bla"
           // add if for other cases in which the auth source is forced in the future.
           else{
            extractTokenFromRequest(msg.req).then(function(token){
                msg.token = token;
                node.send(msg);
            }).catch(function(error){
                node.error("something went wrong when getting token: " + error,msg);
                node.send(msg);
            });
          }
        });
    }
    RED.nodes.registerType("idm-token",TokenExtractNode, {credentials: {
     clientId: {type:"text"},
     clientSecret: {type:"password"}
    }});
}
