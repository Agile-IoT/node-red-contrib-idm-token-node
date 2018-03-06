
var client = undefined;

function handleError(node,error, action, msg) {
    node.warn('something went wrong while executing s3 node client : '+error)
    msg.error = "SecretSharingNode.cannot-execute-"+action+":"+error
    node.status({fill:"red",shape:"ring",text:"cannot "+action});
}
function init(config, node, cb){
  if( config.username &&
      config.password &&
     config.bucket &&
     config.host &&
     config.port
   ){
     try{
       var knox = require('knox');
       client = knox.createClient({
         key: config.username,
         secret: config.password,
         bucket: config.bucket,
         endpoint: config.host,
         style: 'path',
         port: config.port
       });
       node.log('client created ')
       node.status({fill:"green",shape:"dot",text:"ok"});
     } catch(error) {
       node.err('something went wrong while loading s3 client : '+error)
       node.status({fill:"red",shape:"ring",text:"disconnected"});
     }

   }
   else {
     node.warn("not enough parameters configured for the s3-secret node")
   }
   cb();
}

function read(filename, cb){
    if(!filename ){
      cb(new Error('filename for file to be read was not provided'))
    }
    try{
      var req = client.get(filename)
      req.on('error',function(error){
        cb(error)
      });
      req.on('response', function(res){
      console.log(`status code ${res.statusCode}`);
      console.log(`headers : ${res.headers}`);
      res.setEncoding('utf8');
      var x = '';
      res.on('data', function(chunk){
        console.log('got chunk')
        console.log(chunk);
        x = x+chunk
      });
      res.on('end', function(){
        cb(null, x)
      })
      res.on('error',function(error){
        cb(error)
      })
    }).end();

  } catch(error) {
     cb(error)
  }
}

function write(object, filename, cb){
  if(!filename ||  !object){
    cb(new Error('either filename or data to be stored was not provided'))
  }
  var string = JSON.stringify(object);
  try{
    var req = client.put(filename, {
        'Content-Length': Buffer.byteLength(string)
      , 'Content-Type': 'application/json'
    });
    req.on('response', function(res){
      if (200 == res.statusCode) {
        console.log('saved to %s', req.url);
        cb(null,{location:req.url})
      }
      else {
        cb(new Error(`unexpected status Code ${res.statusCode}`))
      }

    });
    req.on('error',function(error){
      cb(error)
    })
    console.log(`sending string ${string}`)
    req.end(string);
  } catch(error) {
     cb(error)
  }
}


module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        init(config, node, function(){
          node.on('input', function(msg) {
              if(msg.payload && msg.filename && msg.method && msg.method.toUpperCase() === "WRITE"){
                write(msg.payload, msg.filename, function(error, result){
                  if(error){
                    handleError(node, error, msg.method, msg)
                  } else {
                    node.status({fill:"green",shape:"dot",text:"ok"});
                    if(result && result.location){
                      msg.location = result.location
                    }
                  }
                  node.send(msg);
                })
              }
              else if(msg.payload && msg.filename && msg.method && msg.method.toUpperCase() === "READ"){
                read(msg.filename, function(error, data){
                  if(error){
                    handleError(node, error, msg.method, msg)
                  } else {
                    node.status({fill:"green",shape:"dot",text:"ok"});
                  }
                  msg.payload = data
                  node.send(msg);
                })

              } else {
                node.warn('invalid arguments, the s3 secret node requires payload, filename, and method (READ, WRITE) to be passed in the message')
                node.send(msg)
              }


          });
        })

    }
    RED.nodes.registerType("s3-secret-sharing",LowerCaseNode);
}
