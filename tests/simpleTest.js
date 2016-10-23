var assert = require('assert');
var StudentDAO = require("../backend/persistency/StudentDAO.js");
var Student = require("../backend/model/Student.js");
var CourseDAO = require("../backend/persistency/CourseDAO.js");
var Course = require("../backend/model/Course.js");
var EnrollmentDAO = require("../backend/persistency/EnrollmentDAO.js");
var Enrollment = require("../backend/model/Enrollment.js");
var StudentStatistics = require("../backend/StudentStatistics.js");

describe('StudentStatsTests', function() {
  describe('crear estudiante', function() {
    it('el alumno no existía', function() {
      var studentDAO = new StudentDAO();
    	studentDAO.findById("S1993", function(error, data) {
        assert.true(!data || data.length == 0);
      });
    });
    it('se crea el alumno correctamente', function() {
      var studentDAO = new StudentDAO();
      var student = new Student("S1993", "Raul", "Estrada", "08-05-1993", "Hombre");
    	studentDAO.saveAll([student], function(error, data) {
        assert.true(!error || error.length == 0);
      });
    });
    it('el alumno ya se encuentra', function() {
      var studentDAO = new StudentDAO();
    	studentDAO.findById("S1993", function(error, data) {
        assert.true(data.length > 0);
      });
    });
    it('el alumno se elimina correctamente', function() {
      var studentDAO = new StudentDAO();
    	studentDAO.removeById("S1993", function(error, data) {
        assert.true(!error || error.length == 0);
      });
    });
  });

  describe('metodo nota media', function() {
    it('se crea el alumno correctamente', function() {
      var studentDAO = new StudentDAO();
      var student = new Student("S1993", "Raul", "Estrada", "08-05-1993", "Hombre");
    	studentDAO.saveAll([student], function(error, data) {
        assert.true(!error || error.length == 0);
      });
    });
    it('se crean dos cursos correctamente', function() {
      var courseDAO = new CourseDAO();
      var course = new Course("C1993", "2014-15");
      var course2 = new Course("C1994", "2014-15");
    	courseDAO.saveAll([course, course2], function(error, data) {
        assert.true(!error || error.length == 0);
      });
    });
    it('se añaden notas a los cursos', function() {
      var enrollmentDAO = new EnrollmentDAO();
      var enrollment = new Enrollment("1", 7, "S1993", "2014-15", "C1993");
      var enrollment2 = new Enrollment("1", 3, "S1993", "2014-15", "C1994");
    	enrollmentDAO.saveAll([enrollment, enrollment2], function(error, data) {
        assert.true(!error || error.length == 0);
      });
    });
    it('debe devolver la nota media por asignatura', function() {
      var student = new Student("S1993", "Raul", "Estrada", "08-05-1993", "Hombre");
      var course = new Course("C1993", "2014-15");
      var course2 = new Course("C1994", "2014-15");
      var enrollment = new Enrollment("1", 7, "S1993", "2014-15", "C1993");
      var enrollment2 = new Enrollment("1", 3, "S1993", "2014-15", "C1994");
      var studentDAO = new StudentDAO();
      var courseDAO = new CourseDAO();
      var enrollmentDAO = new EnrollmentDAO();
      studentDAO.saveAll([student], function(error, data) {
        courseDAO.saveAll([course, course2], function(error, data) {
          enrollmentDAO.saveAll([enrollment, enrollment2], function(error, data) {
            var stat = new StudentStatistics();
            var obtenido = stat.getStatsJSON("S1993");
            var asignaturaStats = obtenido.datosAsignaturas;
            assert.equal(7, asignaturaStats["C1993"]);
            assert.equal(3, asignaturaStats["C1994"]);
          });
        });
      });
    });
    it('debe devolver la nota media total', function() {
      var student = new Student("S1993", "Raul", "Estrada", "08-05-1993", "Hombre");
      var course = new Course("C1993", "2014-15");
      var course2 = new Course("C1994", "2014-15");
      var enrollment = new Enrollment("1", 7, "S1993", "2014-15", "C1993");
      var enrollment2 = new Enrollment("1", 3, "S1993", "2014-15", "C1994");
      var studentDAO = new StudentDAO();
      var courseDAO = new CourseDAO();
      var enrollmentDAO = new EnrollmentDAO();
      studentDAO.saveAll([student], function(error, data) {
        courseDAO.saveAll([course, course2], function(error, data) {
          enrollmentDAO.saveAll([enrollment, enrollment2], function(error, data) {
            var stat = new StudentStatistics();
            var obtenido = stat.getStatsJSON("S1993");
            var stats = obtenido.notaMedia;
            assert.equal(5, stats);
          });
        });
      });
    });
    it('debe devolver las notas alfabéticas', function() {
      var student = new Student("S1993", "Raul", "Estrada", "08-05-1993", "Hombre");
      var course = new Course("C1993", "2014-15");
      var course2 = new Course("C1994", "2014-15");
      var enrollment = new Enrollment("1", 7, "S1993", "2014-15", "C1993");
      var enrollment2 = new Enrollment("1", 3, "S1993", "2014-15", "C1994");
      var studentDAO = new StudentDAO();
      var courseDAO = new CourseDAO();
      var enrollmentDAO = new EnrollmentDAO();
      studentDAO.saveAll([student], function(error, data) {
        courseDAO.saveAll([course, course2], function(error, data) {
          enrollmentDAO.saveAll([enrollment, enrollment2], function(error, data) {
            var stat = new StudentStatistics();
            var obtenido = stat.getStatsJSON("S1993");
            var statsAlfabeticas = obtenido.datosNotasNumericas;
            assert.equal(1, statsAlfabeticas["Notable"]);
            assert.equal(1, statsAlfabeticas["Suspenso"]);
            assert.equal(0, statsAlfabeticas["Sobresaliente"]);
            assert.equal(0, statsAlfabeticas["Aprobado"]);
            assert.equal(0, statsAlfabeticas["NP"]);
          });
        });
      });
    });
    it('las notas se eliminan correctamente', function() {
      var enrollmentDAO = new EnrollmentDAO();
      enrollmentDAO.removeByIds("C1993", "2014-15", "S1993", function(error, data) {
        enrollmentDAO.removeByIds("C1994", "2014-15", "S1993", function(error, data) {
          assert.true(!error || error.length == 0);
        });
      });
    });
    it('los cursos se eliminan correctamente', function() {
      var courseDAO = new CourseDAO();
      courseDAO.removeById("C1993", function(error, data) {
        courseDAO.removeById("C1994", function(error, data) {
          assert.true(!error || error.length == 0);
        });
      });
    });
    it('el alumno se elimina correctamente', function() {
      var studentDAO = new StudentDAO();
      studentDAO.removeById("S1993", function(error, data) {
        assert.true(!error || error.length == 0);
      });
    });
  });

});
