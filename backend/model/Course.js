class Course {
  constructor(id, course) {
    this.id = id;
    this.course = course;
  }

  static convertFromJSON(courseJSON) {
    return new Course(courseJSON.id, courseJSON.curso);
  }

  json() {
    return {id: this.id, course: this.course};
  }
}

module.exports = Course;
