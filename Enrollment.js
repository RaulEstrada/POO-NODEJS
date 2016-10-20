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
}

module.exports = Enrollment;
