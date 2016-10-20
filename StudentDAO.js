var connection = require('./MySQLConnector.js');
var Student = require('./Student.js');

class StudentDAO {
  findAll() {
    connection.query("SELECT * FROM estudiante", function(error, rows, fields) {
      if (error) {
        throw error;
      }
      var students = [];
      for (var indx = 0; indx < rows.length; indx++) {
        var tuple = rows[indx];
        var student = new Student(tuple.id, tuple.nombre, tuple.apellidos,
          tuple.fecha_nacimiento, tuple.genero);
        students.push(student);
      }
      return students;
    });
  }

  removeAll(callback) {
    connection.query("DELETE FROM estudiante", function(error, data) {
      if (error) {
        throw error;
      }
      if (callback) {
        callback();
      }
    });
  }

  saveAll(students) {
    var sql = "INSERT INTO estudiante (id, nombre, apellidos, fecha_nacimiento, genero) VALUES ";
    for (var indx = 0; indx < students.length; indx++) {
      var student = students[indx];
      sql = sql + "('" + student.id + "', '" + student.name + "', '" + student.surname + "', '" + student.dateOfBirth + "', '" + student.genre + "')";
      if (indx < students.length-1) {
        sql = sql + ", ";
      }
    }
    connection.query(sql, function(error, data) {
      if (error) {
        throw error;
      }
    });
  }
}

module.exports = StudentDAO;
