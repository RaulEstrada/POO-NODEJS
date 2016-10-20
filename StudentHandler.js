var StudentDAO = require('./StudentDAO.js');
var Student = require('./Student.js');

class StudentLoader {
  processRequest(req, res) {
    if (req.method == "POST") {
      this.loadStudents(req, res);
    } else if (req.method == "GET") {
      this.getAllStudents(req, res);
    }
  }

  loadStudents(req, res) {
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
      console.log(body);
      var students = self.createModelFromJSON(body);
      new StudentDAO().saveAll(students);
    });
  }

  getAllStudents(req, res) {
    var students = new StudentDAO().findAll();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(students));
  }

  createModelFromJSON(jsonString) {
    console.log(jsonString);
    var json = JSON.parse(jsonString);
    var studentsJSON = json.personas;
    var students = [];
    for (var indx = 0; indx < studentsJSON.length; indx++) {
      var student = Student.convertFromJSON(studentsJSON[indx]);
      students.push(student);
    }
    return students;
  }
}

module.exports = StudentLoader;
