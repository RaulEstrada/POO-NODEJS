class Course {
  constructor(id, course) {
    this.id = id;
    this.course = course;
  }

  static convertFromJSON(courseJSON) {
    return new Course(courseJSON.id, courseJSON.curso);
  }
}

module.exports = Course;
