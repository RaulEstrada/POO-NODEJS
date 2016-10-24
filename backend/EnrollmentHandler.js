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
          var json;
          try {
            json = JSON.parse(datos)
          } catch (err) {
            res.send({errorEnrollment: "Error parseando el fichero JSON"});
            return;
          }
          courseDAO.findByIDAndCourse(json.id, json.curso, function(error, data) {
            var enrollmentsResult = self.createModelFromJSON(json.notas, json.convocatoria, json.curso, json.id);
            if (enrollmentsResult.errorsInvalidGrades && enrollmentsResult.errorsInvalidGrades.length > 0) {
              res.send({errorInvalidGrade : enrollmentsResult.errorsInvalidGrades});
              return;
            }
            var enrollments = enrollmentsResult.enrollments;
            if (!data || data.length == 0) {
              self.checkRepeatedGrades(self, 0, enrollmentDAO, json.notas, json.id, [], function(errorsRepeatedGrades) {
                if (errorsRepeatedGrades && errorsRepeatedGrades.length>0) {
                  res.send({errorsRepeatedGrades : errorsRepeatedGrades});
                  return;
                }
                var course = Course.convertFromJSON(json);
                courseDAO.saveAll([course], function(errorCourse, dataCourse) {
                  self.createEnrollments(errorCourse, course.json(), enrollmentDAO, enrollments, res);
                });
              });
            } else {
              enrollmentDAO.findCourseByNumberAndCourse(json.id, json.curso, json.convocatoria, function(errorRepeticion) {
                if (errorRepeticion && errorRepeticion != "") {
                  res.send({errorCourse: errorRepeticion, course: "", enrollments: [],
                    errorEnrollment: ""});
                } else {
                  self.checkRepeatedGrades(self, 0, enrollmentDAO, json.notas, json.id, [], function(errorsRepeatedGrades) {
                    if (errorsRepeatedGrades && errorsRepeatedGrades.length>0) {
                      res.send({errorsRepeatedGrades : errorsRepeatedGrades});
                      return;
                    }
                    self.createEnrollments("", "", enrollmentDAO, enrollments, res);
                  });
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
    var enrollments = new EnrollmentDAO().findAll(function(error, data) {
      res.send({error: error, enrollments: data.map((x) => x.json())});
    });
  }

  deleteAllEnrollments(req, res) {
    var enrollmentDAO = new EnrollmentDAO();
    enrollmentDAO.removeAll(function(error, data) {
      res.send({error: error, data: data});
    })
  }

  checkRepeatedGrades(self, indx, enrollmentDAO, jsonEnrollments, courseId, errorsRepeatedGrades, callback) {
    if (indx == jsonEnrollments.length) {
      callback(errorsRepeatedGrades);
    } else {
      enrollmentDAO.findByStudentAndCourse(jsonEnrollments[indx].id, courseId, function(errorMsg) {
        if (errorMsg && errorMsg != "") {
          errorsRepeatedGrades.push(errorMsg);
        }
        self.checkRepeatedGrades(self, indx + 1, enrollmentDAO, jsonEnrollments, courseId, errorsRepeatedGrades, callback);
      });
    }
  }

  createModelFromJSON(jsonEnrollments, number, course, courseId) {
    var enrollments = [];
    var errorsInvalidGrades = [];
    var enrollmentDAO = new EnrollmentDAO();
    for (var indx = 0; indx < jsonEnrollments.length; indx++) {
      try {
        var enrollment = Enrollment.convertFromJSON(jsonEnrollments[indx], number, course, courseId);
        enrollments.push(enrollment);
      } catch (err) {
        errorsInvalidGrades.push(err.message);
      }
    }
    return {enrollments: enrollments, errorsInvalidGrades: errorsInvalidGrades};
  }
}

module.exports = EnrollmentHandler;
