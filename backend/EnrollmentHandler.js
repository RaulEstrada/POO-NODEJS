const CourseDAO = require('./persistency/CourseDAO.js'),
  Course = require('./model/Course.js'),
  EnrollmentDAO = require('./persistency/EnrollmentDAO.js'),
  Enrollment = require('./model/Enrollment.js'),
  formidable = require('formidable'),
  fs = require('fs');

class EnrollmentHandler {

  postAllEnrollments(req, res) {
    var form = new formidable.IncomingForm();
    var self = this;
    var courseDAO = new CourseDAO();
    var enrollmentDAO = new EnrollmentDAO();
    form.parse(req, function(err, fields, files) {
      fs.readFile(files.ficheroConvocatoria.path,'utf8', (err,datos) => {
          if (err) {
            throw err;
          }
          let json = JSON.parse(datos);
          courseDAO.findByIDAndCourse(json.id, json.curso, function(error, data) {
            var enrollments = self.createModelFromJSON(json.notas, json.convocatoria, json.curso, json.id);
            if (!data || data.length == 0) {
              var course = Course.convertFromJSON(json);
              courseDAO.saveAll([course], function(errorCourse, dataCourse) {
                self.createEnrollments(errorCourse, course.json(), enrollmentDAO, enrollments, res);
              });
            } else {
              enrollmentDAO.findCourseByNumberAndCourse(json.id, json.curso, json.convocatoria, function(errorRepeticion) {
                if (errorRepeticion && errorRepeticion != "") {
                  res.send({errorCourse: errorRepeticion, course: "", enrollments: [],
                    errorEnrollment: ""});
                } else {
                  self.createEnrollments("", "", enrollmentDAO, enrollments, res);
                }
              })
            }
          });
    })});
  }

  createEnrollments(errorCourse, courseJSON, enrollmentDAO, enrollments, res){
    enrollmentDAO.saveAll(enrollments, function(errorEnrollment, dataEnrollment) {
      var errorEstudianteMissing = "";
      if (errorEnrollment && errorEnrollment != "") {
        errorEstudianteMissing = "Error. Hay notas que hacen referencia a un estudiante que no ha sido cargado. No se procesa la subida.";
      }
      res.send({errorCourse: errorCourse, course: courseJSON,
        enrollments: enrollments.map((x) => x.json()), errorEnrollment: errorEstudianteMissing});
    });
  }

  getAllEnrollments(req, res) {
    var enrollments = new EnrollmentDAO().findAll(function(data) {
      var response = {};
      response["enrollments"] = data.map((x) => x.json());
      res.jsonp(response);
    });
  }

  deleteAllEnrollments(req, res) {
    var enrollmentDAO = new EnrollmentDAO();
    enrollmentDAO.removeAll(function(data) {
      res.jsonp({data: data});
    })
  }

  createModelFromJSON(jsonEnrollments, number, course, courseId) {
    var enrollments = [];
    for (var indx = 0; indx < jsonEnrollments.length; indx++) {
      var enrollment = Enrollment.convertFromJSON(jsonEnrollments[indx], number, course, courseId);
      enrollments.push(enrollment);
    }
    return enrollments;
  }
}

module.exports = EnrollmentHandler;
