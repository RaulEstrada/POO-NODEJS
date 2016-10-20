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
    form.parse(req, function(err, fields, files) {
      fs.readFile(files.ficheroConvocatoria.path,'utf8', (err,datos) => {
          if (err) {
            throw err;
          }
          let json = JSON.parse(datos);
          var course = Course.convertFromJSON(json);
          var enrollments = self.createModelFromJSON(json.notas, json.convocatoria, json.id);
          new CourseDAO().saveAll([course], function(dataCourse) {
            new EnrollmentDAO().saveAll(enrollments, function(dataEnrollment) {
              res.jsonp({course: course.json(), enrollments: enrollments.map((x) => x.json())});
            });
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
