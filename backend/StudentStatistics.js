const EnrollmentDAO = require('./persistency/EnrollmentDAO.js'),
  BaseStatistics = require('./BaseStatistics.js');

class StudentStatistics extends BaseStatistics {
  getStudentStats(req, res) {
    var studentId = req.params['userId'];
    this.getStats(req, res, studentId);
  }

  getAllStudentStats(req, res) {
    this.getStats(req, res, null);
  }

  getStats(req, res, studentId) {
    var self = this;
    var enrollmentDAO = new EnrollmentDAO();
    enrollmentDAO.findByEstudiante(studentId, function(error, data) {
      res.send(
        {datosAsignaturas: self.getDatosAsignaturas(data),
        notaMedia: self.getDatosMedia(data),
        datosNotasNumericas: self.getDatosLetra(data),
        datosCursoAcademico: self.getDatosPorCursoAcademico(data)}
      );
    });
  }

  // Este método es para las pruebas
  getStatsJSON(studentId) {
    var self = this;
    var enrollmentDAO = new EnrollmentDAO();
    enrollmentDAO.findByEstudiante(studentId, function(error, data) {
      return {datosAsignaturas: self.getDatosAsignaturas(data),
        notaMedia: self.getDatosMedia(data),
        datosNotasNumericas: self.getDatosLetra(data),
        datosCursoAcademico: self.getDatosPorCursoAcademico(data)};
    });
  }

  getDatosAsignaturas(data) {
    var datosAsignaturas = {};
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota == "NP") {
        continue;
      }
      var curso = nota.curso;
      if (!(curso in datosAsignaturas)) {
        datosAsignaturas[curso] = {alumnos: 0, sumaNotas: 0};
      }
      datosAsignaturas[curso].alumnos += 1;
      datosAsignaturas[curso].sumaNotas += parseFloat(nota.nota);
    }
    var resultado = {};
    for (var asignatura in datosAsignaturas) {
      resultado[asignatura] = datosAsignaturas[asignatura].sumaNotas / datosAsignaturas[asignatura].alumnos;
    }
    return resultado;
  }

  getDatosLetra(data) {
    var datosAsignaturas = {"Sobresaliente": 0, "Notable": 0, "Aprobado": 0, "Suspenso": 0, "NP": 0};
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota == "NP") {
        datosAsignaturas[nota.nota] += 1;
      } else {
        var notaAlfabetica = this.getNotaAlfabetica(parseFloat(nota.nota));
        datosAsignaturas[notaAlfabetica] += 1;
      }
    }
    return datosAsignaturas;
  }

  getDatosPorCursoAcademico(data) {
    var datosCurso = {};
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota == "NP") {
        continue;
      }
      var curso = nota.curso;
      if (!(curso in datosCurso)) {
        datosCurso[curso] = {sumaNotas: 0, alumnos: 0};
      }
      datosCurso[curso].sumaNotas += parseFloat(nota.nota);
      datosCurso[curso].alumnos += 1;
    }
    var result = {};
    for (var cursoData in datosCurso) {
      result[cursoData] = datosCurso[cursoData].sumaNotas / datosCurso[cursoData].alumnos;
    }
    return result;
  }
}

module.exports = StudentStatistics;
