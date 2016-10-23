var connection = require('./MySQLConnector.js');
var Student = require('./../model/Student.js');

class StudentDAO {
  findAll(callback) {
    connection.query("SELECT * FROM estudiante", function(error, rows, fields) {
      var students = [];
      for (var indx = 0; indx < rows.length; indx++) {
        var tuple = rows[indx];
        var student = new Student(tuple.id, tuple.nombre, tuple.apellidos,
          tuple.fecha_nacimiento, tuple.genero);
        students.push(student);
      }
      if (callback) {
          callback(error, students);
      }
    });
  }

  removeAll(callback) {
    connection.query("DELETE FROM estudiante", function(error, data) {
      if (callback) {
        callback(error, data);
      }
    });
  }

  findById(id, callback) {
    connection.query("SELECT * FROM estudiante WHERE id = '" + id + "'", function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  removeById(id, callback) {
    connection.query("DELETE FROM estudiante WHERE id = '" + id + "'", function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  saveAll(students, callback) {
    var sql = "INSERT INTO estudiante (id, nombre, apellidos, fecha_nacimiento, genero) VALUES ";
    for (var indx = 0; indx < students.length; indx++) {
      var student = students[indx];
      sql = sql + "('" + student.id + "', '" + student.name + "', '" + student.surname + "', '" + student.dateOfBirth + "', '" + student.gender + "')";
      if (indx < students.length-1) {
        sql = sql + ", ";
      }
    }
    connection.query(sql, function(error, data) {
      if (callback) {
        callback(error, data);
      }
    });
  }
}

module.exports = StudentDAO;
