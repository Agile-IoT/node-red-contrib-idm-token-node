var request = require('request');
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





function authenticateClient(node, url,client,secret) {
  return new Promise(function(resolve, reject){
    var auth = "Basic " + new Buffer(client + ":" + secret).toString("base64");
    request({
          method : "POST",
          url : url+"/oauth2/token",
          form: {
            grant_type:'client_credentials'
          },
          headers : {
            "Authorization" : auth
         }
    },
    function (error, response, body) {
          if(error){
            return reject(error);
          }
          if(response.statusCode === 200){
            var result = JSON.parse(body);
            if(result.access_token){
              //var type  = result.token_type;
              return resolve(result.access_token);
            }
          }
          else{
              return reject("unexpected result from IDM status code: " + response.statusCode+ " response: "+ body);
          }
    });
  });

}

function extractTokenFromContext(node, config){
  return new Promise(function(resolve,reject){
    if(node.context().get("token")){
      return resolve(node.context().get("token"));
    }
    else if(node.credentials.clientId && node.credentials.clientSecret ){
      authenticateClient(node, config.idm ,node.credentials.clientId ,node.credentials.clientSecret).then(function(token){
        node.context().set("token", token);
        return resolve(token);
      }, reject);
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
            extractTokenFromContext(node, config).then(function(token){
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
