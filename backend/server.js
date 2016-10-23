const express = require('express'),
  StudentHandler = require('./StudentHandler.js'),
  EnrollmentHandler = require('./EnrollmentHandler.js'),
  CourseHandler = require('./CourseHandler.js'),
  CleanHandler = require('./CleanHandler.js'),
  StudentStatistics = require('./StudentStatistics.js'),
  CourseStatistics = require('./CourseStatistics.js'),
  AsignaturaStatistics = require('./AsignaturaStatistics.js'),
  app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
  res.setHeader('Content-Type', 'application/json');
  next();
});
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
app.post('/clean', function(req, res) {
  new CleanHandler().processRequest(req, res);
});
app.get('/statistics/users/:userId', function(req, res) {
  new StudentStatistics().getStudentStats(req, res);
});
app.get('/statistics/users', function(req, res) {
  new StudentStatistics().getAllStudentStats(req, res);
});
app.get('/statistics/course/:courseId', function(req, res) {
  new CourseStatistics().getCourseStats(req, res);
});
app.get('/statistics/course', function(req, res) {
  new CourseStatistics().getAllCourseStats(req, res);
});
app.get('/statistics/asignatura/:courseId', function(req, res) {
  new AsignaturaStatistics().getAsignaturaStats(req, res);
});
app.get('/statistics/asignatura', function(req, res) {
  new AsignaturaStatistics().getAllAsignaturaStats(req, res);
});

app.listen(3000);
