var connection = require('./MySQLConnector.js');
var Enrollment = require('./Enrollment.js');

class EnrollmentDAO {
  findAll() {
    connection.query("SELECT * FROM nota", function(error, rows, fields) {
      if (error) {
        throw error;
      }
      var enrollments = [];
      for (var indx = 0; indx < rows.length; indx++) {
        var tuple = rows[indx];
        var enrollment = new Enrollment(tuple.convocatoria, tuple.nota, tuple.curso,
          tuple.estudiante);
        enrollments.push(enrollment);
      }
      return enrollments;
    });
  }

  removeAll(callback) {
    connection.query("DELETE FROM nota", function(error, data) {
      if (error) {
        throw error;
      }
      if (callback) {
        callback();
      }
    });
  }

  saveAll(enrollments) {
    var sql = "INSERT INTO nota (convocatoria, nota, curso, estudiante) VALUES ";
    for (var indx = 0; indx < enrollments.length; indx++) {
      var enrollment = enrollments[indx];
      sql = sql + "('" + enrollment.number + "', '" + enrollment.grade + "', '" + enrollment.course + "', '" + enrollment.student + "')";
      if (indx < enrollments.length-1) {
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

module.exports = EnrollmentDAO;
