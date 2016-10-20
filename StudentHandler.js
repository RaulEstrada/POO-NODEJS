const StudentDAO = require('./StudentDAO.js'),
  Student = require('./Student.js'),
  formidable = require('formidable'),
  fs = require('fs');

class StudentLoader {
  postAllStudents(req, res) {
    var form = new formidable.IncomingForm();
    var self = this;
    form.parse(req, function(err, fields, files) {
      fs.readFile(files.ficheroEstudiantes.path,'utf8', (err,datos) => {
          if (err) {
            throw err;
          }
          let json = JSON.parse(datos);
          var students = self.createModelFromJSON(json);
          new StudentDAO().saveAll(students, function() {
            res.jsonp({students: students.map((x) => x.json())});
          });
    })});
  }

  getAllStudents(req, res) {
    var studentDAO = new StudentDAO();
    var students = studentDAO.findAll(function(data) {
      var response = {};
      response["students"] = data.map((x) => x.json());
      res.jsonp(response);
    });
  }

  deleteAllStudents(req, res) {
    var studentDAO = new StudentDAO();
    studentDAO.removeAll(function(data) {
      res.jsonp({data: data});
    })
  }

  createModelFromJSON(json) {
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
