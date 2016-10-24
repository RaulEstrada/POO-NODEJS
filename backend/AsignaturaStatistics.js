const EnrollmentDAO = require('./persistency/EnrollmentDAO.js'),
  BaseStatistics = require('./BaseStatistics.js');

class AsignaturaStatistics extends BaseStatistics {
  getAsignaturaStats(req, res) {
    var courseId = req.params['courseId'];
    this.getStats(req, res, courseId);
  }

  getAllAsignaturaStats(req, res) {
    this.getStats(req, res, null);
  }

  getStats(req, res, courseId) {
    var self = this;
    var enrollmentDAO = new EnrollmentDAO();
    enrollmentDAO.findByAsignatura(courseId, function(error, data) {
      res.send(
        {datosCursosMedia: self.getDatosPorCurso(data),
        cursosNotasAlfabeticas: self.getNotasAlfabeticas(data)}
      );
    })
  }

  getDatosPorCurso(data) {
    var datosCursos = {};
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota == "NP") {
        continue;
      }
      var curso = nota.curso;
      if (!(curso in datosCursos)) {
        datosCursos[curso] = {};
      }
      var convocatoria = nota.convocatoria;
      if (!(convocatoria in datosCursos[curso])) {
        datosCursos[curso][convocatoria] = {alumnos: 0, sumaNotas: 0};
      }
      datosCursos[curso][convocatoria].alumnos += 1;
      datosCursos[curso][convocatoria].sumaNotas += parseFloat(nota.nota);
    }
    var result = {};
    for (var cursoIndx in datosCursos) {
      result[cursoIndx] = {};
      for (var covocatoriaIndx in datosCursos[cursoIndx]) {
        result[cursoIndx][covocatoriaIndx] = datosCursos[cursoIndx][covocatoriaIndx].sumaNotas / datosCursos[cursoIndx][covocatoriaIndx].alumnos;
      }
    }
    return result;
  }

  getNotasAlfabeticas(data) {
    var datosCursos = {};
    for (var notaData in data) {
      var nota = data[notaData];
      var curso = nota.curso;
      if (!(curso in datosCursos)) {
        datosCursos[curso] = {"Sobresaliente": 0, "Notable": 0, "Aprobado": 0, "Suspenso": 0, "NP": 0};
      }
      var notaNota = nota.nota;
      if (notaNota != "NP") {
        notaNota = this.getNotaAlfabetica(parseFloat(notaNota));
      }
      datosCursos[curso][notaNota] += 1;
    }
    return datosCursos;
  }
}

module.exports = AsignaturaStatistics;
