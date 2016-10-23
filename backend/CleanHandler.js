var StudentDAO = require('./persistency/StudentDAO.js');
var CourseDAO = require('./persistency/CourseDAO.js');
var EnrollmentDAO = require('./persistency/EnrollmentDAO.js');

class CleanHandler {
  processRequest(req, res) {
    if (req.method == "POST") {
      this.cleanDatabase(req, res);
      res.setHeader('Content-Type', 'application/json');
      res.send({message:"Elementos eliminados"});
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send({error: "Método no soportado en endpoint /clean"});
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
