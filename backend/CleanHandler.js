var StudentDAO = require('./persistency/StudentDAO.js');
var CourseDAO = require('./persistency/CourseDAO.js');
var EnrollmentDAO = require('./persistency/EnrollmentDAO.js');

class CleanHandler {
  processRequest(req, res) {
    if (req.method == "POST") {
      this.cleanDatabase(req, res);
    } else {
      res.writeHead(404, {'Content-Type': 'text/hml'});
      res.end("Método no soportado en endpoint /clean");
    }
  }

  cleanDatabase(req, res) {
    new EnrollmentDAO().removeAll(function() {
      new CourseDAO().removeAll(function() {
        new StudentDAO().removeAll();
      })
    });
  }
}

module.exports = CleanHandler;
