class Enrollment {
  constructor(number, grade, student, course, courseId) {
    this.number = number;
    this.grade = grade;
    this.student = student;
    this.course = course;
    this.courseId = courseId;
  }

  static convertFromJSON(enrollmentJSON, number, course, courseId) {
    var grade = enrollmentJSON.valor;
    if ((isNaN(grade) && grade != "NP") || (!isNaN(grade) && (grade < 0 || grade > 10))) {
      throw new Error("Nota inválida: " + grade);
    }
    return new Enrollment(number, grade, enrollmentJSON.id, course, courseId);
  }

  json() {
    return {number: this.number, grade: this.grade, student: this.student, course: this.course, courseId: this.courseId};
  }
}

module.exports = Enrollment;
