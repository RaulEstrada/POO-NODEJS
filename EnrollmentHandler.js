var CourseDAO = require('./CourseDAO.js');
var Course = require('./Course.js');
var EnrollmentDAO = require('./EnrollmentDAO.js');
var Enrollment = require('./Enrollment.js');

class EnrollmentHandler {
  processRequest(req, res) {
    if (req.method == "POST") {
      this.loadEnrollments(req, res);
    } else if (req.method == "GET") {
      this.getAllEnrollments(req, res);
    }
  }

  loadEnrollments(req, res) {
    var self = this;
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      var indx = body.indexOf("{");
      body = body.substring(indx, body.length);
      indx = body.indexOf("------WebKitFormBoundary");
      body = body.substring(0, indx);
      var json = JSON.parse(body);
      var course = Course.convertFromJSON(json);
      var enrollments = self.createModelFromJSON(json.notas, json.convocatoria, json.id);
      new CourseDAO().saveAll([course]);
      new EnrollmentDAO().saveAll(enrollments);
      console.log(course);
      console.log(enrollments);
    });
  }

  getAllEnrollments(req, res) {
    var enrollments = new EnrollmentDAO().findAll();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(enrollments));
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
