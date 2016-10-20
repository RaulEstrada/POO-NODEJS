var http = require('http');
var url = require('url');
var StudentHandler = require('./StudentHandler.js');
var EnrollmentHandler = require('./EnrollmentHandler.js');
var CleanHandler = require('./CleanHandler.js');

var processRequest = function(req, res) {
  var requestURL = req.url;
  switch(requestURL) {
    case "/estudiantes":
      new StudentHandler().processRequest(req, res);
      break;
    case "/convocatorias":
      new EnrollmentHandler().processRequest(req, res);
      break;
    case "/clean":
      new CleanHandler().processRequest(req, res);
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/hml'});
      res.end("Endpoint no encontrado");
  }
}

var server = http.createServer();
server.on('request', processRequest);
server.listen(3000);
