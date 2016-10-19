var http = require('http');
var url = require('url');
var StudentLoader = require('./cargarPersonas.js');

var processRequest = function(req, res) {
  var requestURL = req.url;
  switch(requestURL) {
    case "/estudiantes":
      new StudentLoader().processRequest(req, res);
  }
}

var server = http.createServer();
server.on('request', processRequest);
server.listen(3000);
