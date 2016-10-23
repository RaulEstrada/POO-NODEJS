var connection = require('./MySQLConnector.js');
var Course = require('./../model/Course.js');

class CourseDAO {
  findByIDAndCourse(id, course, callback) {
    var self = this;
    connection.query("SELECT * FROM curso WHERE id = '" + id + "' AND curso = '" +
     course + "'", function(error, rows, fields) {
      self.processData(rows, callback, error);
    })
  }

  findAll(callback) {
    var self = this;
    connection.query("SELECT * FROM curso", function(error, rows, fields) {
      if (error) {
        throw error;
      }
      self.processData(rows, callback, error);
    });
  }

  removeById(id, callback) {
    connection.query("DELETE FROM curso WHERE id = '" + id + "'", function(error, rows, fields) {
      if (callback) {
        callback(error, rows);
      }
    });
  }

  processData(rows, callback, error) {
    var list = [];
    for (var indx = 0; indx < rows.length; indx++) {
      var tuple = rows[indx];
      var course = new Course(tuple.id, tuple.curso);
      list.push(course);
    }
    if (callback) {
      callback(error, list);
    }
  }

  removeAll(callback) {
    connection.query("DELETE FROM curso", function(error, data) {
      if (callback) {
        callback(error, data);
      }
    });
  }

  saveAll(courses, callback) {
    var sql = "INSERT INTO curso (id, curso) VALUES ";
    for (var indx = 0; indx < courses.length; indx++) {
      var course = courses[indx];
      sql = sql + "('" + course.id + "', '" + course.course + "')";
      if (indx < courses.length-1) {
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

module.exports = CourseDAO;
