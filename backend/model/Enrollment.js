class Enrollment {
  constructor(number, grade, student, course) {
    this.number = number;
    this.grade = grade;
    this.student = student;
    this.course = course;
  }

  static convertFromJSON(enrollmentJSON, number, course) {
    return new Enrollment(number, enrollmentJSON.valor, enrollmentJSON.id, course);
  }

  json() {
    return {number: this.number, grade: this.grade, student: this.student, course: this.course};
  }
}

module.exports = Enrollment;
