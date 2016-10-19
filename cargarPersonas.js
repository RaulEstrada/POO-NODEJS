var StudentDAO = require('./StudentDAO.js');

class StudentLoader {
  processRequest(req, res) {
    if (req.method == "POST") {
      this.loadStudents(req, res);
    } else if (req.method == "GET") {
      this.getAllStudents(req, res);
    }
  }

  loadStudents(req, res) {
    console.log("LOADING STUDENTS");
    req.on('data', function(chunk) {
      var text = chunk.toString("utf-8");
      console.log(text);
    });
  }

  getAllStudents(req, res) {
    new StudentDAO().findAll();
  }
}

module.exports = StudentLoader;
