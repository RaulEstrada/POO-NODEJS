const express = require('express'),
  StudentHandler = require('./StudentHandler.js'),
  EnrollmentHandler = require('./EnrollmentHandler.js'),
  CleanHandler = require('./CleanHandler.js'),
  app = express();

app.get('/estudiantes', function(req, res){
  new StudentHandler().getAllStudents(req, res);
});
app.post('/estudiantes', function(req, res) {
  new StudentHandler().postAllStudents(req, res);
});
app.delete('/estudiantes', function(req, res) {
  new StudentHandler().deleteAllStudents(req, res);
});
app.get('/convocatorias', function(req, res) {
  new EnrollmentHandler().getAllEnrollments(req, res);
});
app.post('/convocatorias', function(req, res) {
  new EnrollmentHandler().postAllEnrollments(req, res);
});
app.delete('/convocatorias', function(req, res) {
  new EnrollmentHandler().deleteAllEnrollments(req, res);
})
app.get('/clean', function(req, res) {
  new CleanHandler().processRequest(req, res);
});

app.listen(3000);
