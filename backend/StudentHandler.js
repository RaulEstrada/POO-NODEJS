const StudentDAO = require('./persistency/StudentDAO.js'),
  Student = require('./model/Student.js'),
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
          var json;
          try {
            json = JSON.parse(datos)
          } catch (err) {
            res.send({error: "Error parseando fichero JSON", students: []});
            return;
          }
          var students = self.createModelFromJSON(json);
          new StudentDAO().saveAll(students, function(error, data) {
            var errorMsg = "";
            if (error) {
              errorMsg = "No se han podido añadir los alumnos porque hay alumnos repetidos";
            }
            res.send({error: errorMsg, students: students.map((x) => x.json())});
          });
    })});
  }

  getAllStudents(req, res) {
    var studentDAO = new StudentDAO();
    var students = studentDAO.findAll(function(error, data) {
      res.send({error: error, students: data.map((x) => x.json())});
    });
  }

  deleteAllStudents(req, res) {
    var studentDAO = new StudentDAO();
    studentDAO.removeAll(function(error, data) {
      res.send({error: error, data: data})
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
