#IDM-TOKEN Node


This node enables node-red flows to retrieve access tokens from request headers or the session.
The session reflects the user currently logged in the AGILE OSJS framework.


## Testing

For testing, you can paste this flow in the Node-RED screen in the AGILE UI and click on inject to get the user info from the session.

```
[{"id":"4fe95909.b79528","type":"inject","z":"43f6c630.b00e28","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":86,"y":97,"wires":[["3591446a.ee643c"]]},{"id":"f8b1984b.ea15b8","type":"debug","z":"43f6c630.b00e28","name":"","active":true,"console":"false","complete":"token","x":339,"y":278,"wires":[]},{"id":"3591446a.ee643c","type":"idm-token","z":"43f6c630.b00e28","name":"","tokensource":"session","idm":"http://agile-security:3000","x":132,"y":168,"wires":[["f8b1984b.ea15b8","fcde1a90.73d4d"]]},{"id":"fcde1a90.73d4d","type":"function","z":"43f6c630.b00e28","name":"msg.","func":"msg.method = \"GET\";\nmsg.headers = {\"Authorization\":\"bearer \"+msg.token};\nmsg.url = \"http://agile-security:3000/oauth2/api/userinfo\";\nreturn msg;","outputs":1,"noerr":0,"x":297,"y":111,"wires":[["55cd694c.e570b8"]]},{"id":"55cd694c.e570b8","type":"http request","z":"43f6c630.b00e28","name":"","method":"GET","ret":"txt","url":"","x":480,"y":114,"wires":[["c86488e.167e578"]]},{"id":"c86488e.167e578","type":"debug","z":"43f6c630.b00e28","name":"","active":true,"console":"false","complete":"false","x":636,"y":197,"wires":[]}]

```
