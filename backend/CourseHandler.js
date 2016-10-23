const CourseDAO = require('./persistency/CourseDAO.js'),
  Course = require('./model/Course.js'),
  formidable = require('formidable'),
  fs = require('fs');

class CourseHandler {

  postAllCourses(req, res) {
    var form = new formidable.IncomingForm();
    var self = this;
    form.parse(req, function(err, fields, files) {
      fs.readFile(files.ficheroCursos.path,'utf8', (err,datos) => {
          if (err) {
            throw err;
          }
          let json = JSON.parse(datos);
          var courses = self.createModelFromJSON(json.courses);
          new CourseDAO().saveAll(courses, function(error, dataCourse) {
            res.setHeader('Content-Type', 'application/json');
            res.send({error: error, courses: courses.map((x) => x.json())});
          });
    })});
  }

  getAllCourses(req, res) {
    var courses = new CourseDAO().findAll(function(error, data) {
      var response = {error: error};
      response["courses"] = data.map((x) => x.json());
      res.setHeader('Content-Type', 'application/json');
      res.send(response);
    });
  }

  deleteAllCourses(req, res) {
    var courseDAO = new CourseDAO();
    courseDAO.removeAll(function(error, data) {
      res.setHeader('Content-Type', 'application/json');
      res.send({data: data, error: error});
    })
  }

  createModelFromJSON(jsonCourses) {
    var courses = [];
    for (var indx = 0; indx < jsonCourses.length; indx++) {
      var course = Course.convertFromJSON(jsonCourses[indx]);
      courses.push(course);
    }
    return courses;
  }
}

module.exports = CourseHandler;
