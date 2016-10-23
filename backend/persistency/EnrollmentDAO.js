var connection = require('./MySQLConnector.js');
var Enrollment = require('./../model/Enrollment.js');

class EnrollmentDAO {
  findAll(callback) {
    connection.query("SELECT * FROM nota", function(error, rows, fields) {
      var enrollments = [];
      for (var indx = 0; indx < rows.length; indx++) {
        var tuple = rows[indx];
        var enrollment = new Enrollment(tuple.convocatoria, tuple.nota, tuple.curso,
          tuple.estudiante);
        enrollments.push(enrollment);
      }
      if (callback) {
        callback(error, enrollments);
      }
    });
  }

  removeByIds(cursoId, curso, estudianteId, callback) {
    connection.query("DELETE FROM nota WHERE curso_id = '" + cursoId + "' AND curso = '"
      + curso + "' AND estudiante = '" + estudianteId + "'", function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  findCourseByNumberAndCourse(courseId, course, number, callback) {
    var sql = "SELECT n.* FROM nota n WHERE n.convocatoria = '" + number +
      "' AND n.curso_id = '" + courseId + "' AND n.curso = '" + course + "'";
    connection.query(sql, function(error, rows, fields) {
      var msgError = "";
      if (rows && rows.length > 0) {
        msgError = "Ya se ha cargado la convocatoria del curso";
      }
      callback(msgError);
    });
  }

  findByStudentAndCourse(studentId, courseId, callback) {
    var sql = "SELECT n.nota, n.convocatoria, n.estudiante, c.curso FROM nota n, curso c WHERE n.curso_id = c.id AND c.id = '" +
      courseId + "' AND n.estudiante = '" + studentId + "' AND n.nota != 'NP' AND CAST(n.nota AS INTEGER) >= 5 LIMIT 1";
    connection.query(sql, function(error, rows, fields) {
      var msgError = "";
      if (rows && rows.length > 0) {
        var tuple = rows[0];
        msgError = "El alumno " + studentId + " ya a recibido un " + tuple.nota + " en la convocatoria " +
          tuple.convocatoria + " en el curso " + tuple.curso + " de la asignatura" + courseId;
      }
      callback(msgError);
    });
  }

  findByEstudiante(studentId, callback) {
    var sql = "SELECT n.* FROM nota n";
    if (studentId != null) {
      sql = sql + " WHERE n.estudiante = '" + studentId + "'";
    }
    connection.query(sql, function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  findByCurso(curso, callback) {
    var sql = "SELECT e.*, n.* FROM nota n, estudiante e WHERE n.estudiante = e.id";
    if (curso != null) {
      sql = sql + " AND curso = '" + curso + "'";
    }
    connection.query(sql, function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  findByAsignatura(cursoId, callback) {
    var sql = "SELECT e.*, n.* FROM nota n, estudiante e WHERE n.estudiante = e.id";
    if (cursoId != null) {
      sql = sql + " AND curso_id = '" + cursoId + "'";
    }
    connection.query(sql, function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  removeAll(callback) {
    connection.query("DELETE FROM nota", function(error, data) {
      if (callback) {
        callback(error, data);
      }
    });
  }

  saveAll(enrollments, callback) {
    var sql = "INSERT INTO nota (convocatoria, nota, curso, curso_id, estudiante) VALUES ";
    for (var indx = 0; indx < enrollments.length; indx++) {
      var enrollment = enrollments[indx];
      sql = sql + "('" + enrollment.number + "', '" + enrollment.grade + "', '" + enrollment.course +
       "', '" + enrollment.courseId + "', '" + enrollment.student + "')";
      if (indx < enrollments.length-1) {
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

module.exports = EnrollmentDAO;
