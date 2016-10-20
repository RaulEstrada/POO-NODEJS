class Student {
  constructor(id, name, surname, dateOfBirth, gender) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
  }

  static convertFromJSON(studentJSON) {
    var genero = (studentJSON.genero == 1) ? "Hombre" : "Mujer";
    return new Student(studentJSON.id, studentJSON.nombre, studentJSON.apellidos,
      studentJSON.fechaNacimiento, genero);
  }

  json() {
    return {id: this.id, name: this.name, surname: this.surname, dateOfBirth: this.dateOfBirth, gender: this.gender};
  }
}

module.exports = Student;
