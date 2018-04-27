#IDM-TOKEN Node


This node enables node-red flows to retrieve access tokens from request headers or the session.
The session reflects the user currently logged in the AGILE OSJS framework.


## Testing

For testing, you can paste this flow in the Node-RED screen in the AGILE UI and click on inject to get the user info from the session.

```
[{"id":"4fe95909.b79528","type":"inject","z":"43f6c630.b00e28","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":86,"y":97,"wires":[["3591446a.ee643c"]]},{"id":"f8b1984b.ea15b8","type":"debug","z":"43f6c630.b00e28","name":"","active":true,"console":"false","complete":"token","x":339,"y":278,"wires":[]},{"id":"3591446a.ee643c","type":"idm-token","z":"43f6c630.b00e28","name":"","tokensource":"session","idm":"http://agile-security:3000","x":132,"y":168,"wires":[["f8b1984b.ea15b8","fcde1a90.73d4d"]]},{"id":"fcde1a90.73d4d","type":"function","z":"43f6c630.b00e28","name":"msg.","func":"msg.method = \"GET\";\nmsg.headers = {\"Authorization\":\"bearer \"+msg.token};\nmsg.url = \"http://agile-security:3000/oauth2/api/userinfo\";\nreturn msg;","outputs":1,"noerr":0,"x":297,"y":111,"wires":[["55cd694c.e570b8"]]},{"id":"55cd694c.e570b8","type":"http request","z":"43f6c630.b00e28","name":"","method":"GET","ret":"txt","url":"","x":480,"y":114,"wires":[["c86488e.167e578"]]},{"id":"c86488e.167e578","type":"debug","z":"43f6c630.b00e28","name":"","active":true,"console":"false","complete":"false","x":636,"y":197,"wires":[]}]

```

#ARCHISTAR-S3 Secret Sharing


This node enables node-red flows to share data in Amazon Simple Storage Service (S3) buckets, as well as reconstruct the shares back to the original data.
ARCHISTAR-S3 [http://archistar.at/](http://archistar.at/) represents the S3 API that takes care of sharing and reconstructing data with Secret Sharing algorithms and interact with real data stores that offer an interface for S3 data buckets. 

## Setup
### 1. Add the configuration
This configuration will add in-memory S3 data buckets that will be used by the ARCHISTAR-S3 proxy as the actual data store. Furthermore, the configuration contains other information, e.g. the threshold for the Secret Sharing (k).

The configuration file needs to be named ```config.json``` and be placed in ```$DATA/archistar```, where ```$DATA``` represents the path to your configuration files. For agile, this is usually ```~/.agile/```.
```
{
  "locations": [
    {
      "@class": "at.archistar.storage.backend.MemoryStorage",
      "id": "A"
    },
    {
      "@class": "at.archistar.storage.backend.MemoryStorage",
      "id": "B"
    },
    {
      "@class": "at.archistar.storage.backend.MemoryStorage",
      "id": "C"
    },
    {
      "@class": "at.archistar.storage.backend.MemoryStorage",
      "id": "D"
    }
  ],
  "users": [
    {
      "name": "DefaultUser",
      "accessKey": "default",
      "privateKey": "default",
      "locations": [
        "A",
        "B",
        "C",
        "D"
      ],
      "algorithm": "CSS",
      "additionalKey": "dGVzdHRlc3R0ZXN0dGVzdHRlc3R0ZXN0dGVzdHRlc3Q=",
      "k": 3,
      "versioning": "FULL"
    }
  ],
  "buckets": [
    {
      "name": "fake",
      "owner": "DefaultUser"
    },
    {
      "name": "test",
      "owner": "DefaultUser"
    },
    {
      "name": "test-nover",
      "owner": "DefaultUser",
      "versioning": "NONE"
    }
  ]
}
```
### 2. Add ARCHISTAR-S3 to the AGILE stack
```
  archistar-s3:
    image: agileiot/archistar-s3-$AGILE_ARCH:v0.0.1
    container_name: archistar-s3
    restart: always
    ports:
      - 8081:8081/tcp
    networks:
     - default
    volumes:
      - $DATA/archistar/:/archistar/config/
```
where ```$DATA``` represents the path to your configuration files as described before.

## Testing

For testing, you can paste this flow in the Node-RED screen in the AGILE UI. 

It actually contains two flows: One to store the token of the current user with ARCHISTAR-S3, i. e. share them among the S3 buckets. An the other fetches the token with ARCHISTAR-S3 and retrieve the user information of the current user, using the stored token.

```
[{"id":"a6f7052a.dcdb48","type":"tab","label":"Flow 1"},{"id":"b622565c.612f28","type":"s3-secret-sharing","z":"a6f7052a.dcdb48","name":"secret-sharing-node","username":"default","password":"default","bucket":"test","host":"archistar-s3","port":"8081","x":721,"y":177,"wires":[["9597c71d.3b1348","f0378e39.0ae9e"]]},{"id":"9df6f950.3d5138","type":"function","z":"a6f7052a.dcdb48","name":"read-s3-prepare","func":"msg.filename = 'token.json'\nmsg.method = \"read\"\nreturn msg;","outputs":1,"noerr":0,"x":463,"y":357,"wires":[["cbda3381.0b6bb"]]},{"id":"49d67b7c.81f944","type":"function","z":"a6f7052a.dcdb48","name":"write-s3-prepare","func":"msg.payload = msg.token\nmsg.filename = 'token.json'\nmsg.method = \"write\"\nreturn msg;","outputs":1,"noerr":0,"x":490,"y":102,"wires":[["b622565c.612f28"]]},{"id":"9597c71d.3b1348","type":"debug","z":"a6f7052a.dcdb48","name":"","active":true,"console":false,"complete":"payload","x":1021,"y":176,"wires":[]},{"id":"f0378e39.0ae9e","type":"debug","z":"a6f7052a.dcdb48","name":"","active":true,"console":false,"complete":"location","x":1022,"y":222,"wires":[]},{"id":"e5699102.a8e71","type":"inject","z":"a6f7052a.dcdb48","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":236,"y":102,"wires":[["d1d72d47.2f779"]]},{"id":"d1d72d47.2f779","type":"idm-token","z":"a6f7052a.dcdb48","name":"","tokensource":"session","idm":"http://agile-security:3000","x":344,"y":157,"wires":[["49d67b7c.81f944"]]},{"id":"5f704c6c.f4c934","type":"debug","z":"a6f7052a.dcdb48","name":"","active":true,"console":"false","complete":"false","x":1112,"y":300,"wires":[]},{"id":"1f267453.d86afc","type":"http request","z":"a6f7052a.dcdb48","name":"","method":"GET","ret":"txt","url":"","x":1011,"y":404,"wires":[["5f704c6c.f4c934"]]},{"id":"bc442d62.ed7ac","type":"function","z":"a6f7052a.dcdb48","name":"msg.","func":"msg.method = \"GET\";\nmsg.headers = {\"Authorization\":\"bearer \"+JSON.parse(msg.payload)};\nmsg.url = \"http://agile-security:3000/oauth2/api/userinfo\";\nreturn msg;","outputs":1,"noerr":0,"x":892,"y":331,"wires":[["1f267453.d86afc"]]},{"id":"c4076ce8.7af23","type":"inject","z":"a6f7052a.dcdb48","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":223,"y":357,"wires":[["9df6f950.3d5138"]]},{"id":"cbda3381.0b6bb","type":"s3-secret-sharing","z":"a6f7052a.dcdb48","name":"secret-sharing-node","username":"default","password":"default","bucket":"test","host":"archistar-s3","port":"8081","x":707,"y":395,"wires":[["bc442d62.ed7ac","1131ed66.5c1933"]]},{"id":"1131ed66.5c1933","type":"debug","z":"a6f7052a.dcdb48","name":"","active":true,"console":"false","complete":"payload","x":1014,"y":458,"wires":[]}]
```
Both flows can be started by clicking on inject at the beginning of the flows.