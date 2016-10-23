class Enrollment {
  constructor(number, grade, student, course, courseId) {
    this.number = number;
    this.grade = grade;
    this.student = student;
    this.course = course;
    this.courseId = courseId;
  }

  static convertFromJSON(enrollmentJSON, number, course, courseId) {
    return new Enrollment(number, enrollmentJSON.valor, enrollmentJSON.id, course, courseId);
  }

  json() {
    return {number: this.number, grade: this.grade, student: this.student, course: this.course, courseId: this.courseId};
  }
}

module.exports = Enrollment;
