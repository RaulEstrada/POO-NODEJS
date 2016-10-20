var connection = require('./MySQLConnector.js');
var Course = require('./Course.js');

class CourseDAO {
  findAll() {
    connection.query("SELECT * FROM curso", function(error, rows, fields) {
      if (error) {
        throw error;
      }
      var courses = [];
      for (var indx = 0; indx < rows.length; indx++) {
        var tuple = rows[indx];
        var course = new Course(tuple.id, tuple.curso);
        courses.push(course);
      }
      return courses;
    });
  }

  removeAll(callback) {
    connection.query("DELETE FROM curso", function(error, data) {
      if (error) {
        throw error;
      }
      if (callback) {
        callback();
      }
    });
  }

  saveAll(courses) {
    var sql = "INSERT INTO curso (id, curso) VALUES ";
    for (var indx = 0; indx < courses.length; indx++) {
      var course = courses[indx];
      sql = sql + "('" + course.id + "', '" + course.curso + "')";
      if (indx < courses.length-1) {
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

module.exports = CourseDAO;
