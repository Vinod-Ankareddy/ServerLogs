/**
*  logs the message to console and writes the same to file
*  the server object listens on port 8082
*/

const http = require('http');
const url = require('url');
const filehander = require('./filehander');

const PORT = process.env.PORT || 9000
const obj = {}

//create a server object:
const server = http.createServer()
server.on('request', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const queryObject = url.parse(req.url, true).query;
  const platForm = queryObject.platform
  const clear = queryObject.clear
  const log = queryObject.log
  const urlPath = platForm ? "logs-" + platForm + ".txt" : "/logs.txt";

  // if platform empty 403
  // if clearitem part of query parm clear file (check file exit or not)
  // else if log part of query parm append to file 
  // else read content and return (check file exit or not)
  // ip, log, platform, browser(user agent), time(request or now), app name, app version, model

  if (!platForm) {
    if(res.statusCode === 403) { //403
      res.write(JSON.stringify({message: "clear browser cache and refresh your page" }));
      res.end();
    } else {
      res.write(JSON.stringify({message: "Missing mandatory parameter platform" }));
      res.end();
    }
  } else if (clear === "true") {
    if(res.statusCode === 200) {
      filehander.clearAllLogs("logs/logs-" + platForm + ".txt", res); // sus 200 //500 fail to clear logs
      res.write(JSON.stringify({message: platForm +" Logs cleared"}));
      res.end();
    } else if(res.statusCode === 500) {
      res.write(JSON.stringify({message: "Logs not cleared"}));
      res.end();
    }
  } else if (log) {
    obj.platForm = platForm;
    obj.time = queryObject.time || new Date().toISOString().slice(0, 19) + 'Z';
    obj.ip = (req.socket.remoteAddress).replace(/^.*:/, '');
    obj.agent = req.headers['user-agent'];
    obj.appName = queryObject.appName || "";
    obj.appVersion = queryObject.appVersion || "";
    obj.model = queryObject.model || "";
    obj.log = log;

    filehander.writetoFile("logs/logs-" + platForm + ".txt", JSON.stringify(obj) + ',');
    res.write(JSON.stringify({message: "Log added"}));
    res.end();
  } else {
    filehander.readFile("logs/" + urlPath, res)
  }
})

server.listen(PORT, () => {
  console.log("PORT ->", process.env.PORT || 9000)
  console.log("yuppi, server is running  on PORT: " + PORT);
});