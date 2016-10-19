var connection = require('./MySQLConnector.js');

class StudentDAO {
  findAll() {
    connection.connect();
    connection.query("SELECT * FROM estudiante", function(error, rows, fields) {
      if (error) {
        throw error;
      }
      console.log(rows);
    });
    connection.end();
  }
}

module.exports = StudentDAO;
