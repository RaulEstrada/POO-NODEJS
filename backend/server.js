const express = require('express'),
  StudentHandler = require('./StudentHandler.js'),
  EnrollmentHandler = require('./EnrollmentHandler.js'),
  CourseHandler = require('./CourseHandler.js'),
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
});
app.get('/cursos', function(req, res) {
  new CourseHandler().getAllCourses(req, res);
});
app.post('/cursos', function(req, res) {
  new CourseHandler().postAllCourses(req, res);
});
app.delete('/cursos', function(req, res) {
  new CourseHandler().deleteAllCourses(req, res);
});
app.get('/clean', function(req, res) {
  new CleanHandler().processRequest(req, res);
});

app.listen(3000);
