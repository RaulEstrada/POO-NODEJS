const CourseDAO = require('./CourseDAO.js'),
  Course = require('./Course.js'),
  EnrollmentDAO = require('./EnrollmentDAO.js'),
  Enrollment = require('./Enrollment.js'),
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
          courseDAO.findByID(json.id, function(error, data) {
            var enrollments = self.createModelFromJSON(json.notas, json.convocatoria, json.id);
            if (data.length == 0) {
              var course = Course.convertFromJSON(json);
              new CourseDAO().saveAll([course], function(errorCourse, dataCourse) {
                new EnrollmentDAO().saveAll(enrollments, function(dataEnrollment) {
                  res.jsonp({errorCourse: errorCourse, course: course.json(), enrollments: enrollments.map((x) => x.json())});
                });
              });
            } else {
              new EnrollmentDAO().saveAll(enrollments, function(dataEnrollment) {
                res.jsonp({course: "", enrollments: enrollments.map((x) => x.json())});
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

  createModelFromJSON(jsonEnrollments, number, course) {
    var enrollments = [];
    for (var indx = 0; indx < jsonEnrollments.length; indx++) {
      var enrollment = Enrollment.convertFromJSON(jsonEnrollments[indx], number, course);
      enrollments.push(enrollment);
    }
    return enrollments;
  }
}

module.exports = EnrollmentHandler;
