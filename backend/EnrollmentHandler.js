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
              new CourseDAO().saveAll([course], function(errorCourse, dataCourse) {
                new EnrollmentDAO().saveAll(enrollments, function(errorEnrollment, dataEnrollment) {
                  res.send({errorCourse: errorCourse, course: course.json(),
                    enrollments: enrollments.map((x) => x.json()), errorEnrollment: errorEnrollment});
                });
              });
            } else {
              new EnrollmentDAO().saveAll(enrollments, function(errorEnrollment, dataEnrollment) {
                res.send({errorCourse: "", course: "", enrollments: enrollments.map((x) => x.json()),
                  errorEnrollment: errorEnrollment});
              });
            }
          });
    })});
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
