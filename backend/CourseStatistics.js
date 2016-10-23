const EnrollmentDAO = require('./persistency/EnrollmentDAO.js'),
  BaseStatistics = require('./BaseStatistics.js');

class CourseStatistics extends BaseStatistics {
  getCourseStats(req, res) {
    var courseId = req.params['courseId'];
    this.getStats(req, res, courseId);
  }

  getAllCourseStats(req, res) {
    this.getStats(req, res, null);
  }

  getStats(req, res, courseId) {
    var self = this;
    var enrollmentDAO = new EnrollmentDAO();
    enrollmentDAO.findByCurso(courseId, function(error, data) {
      res.send(
        {datosConvocatorias: self.getDatosPorConvocatoria(data),
        notaMedia: self.getDatosMedia(data),
        datosGenero: self.getDatosPorGenero(data)}
      );
    })
  }

  getDatosPorConvocatoria(data) {
    var datosConvocatorias = {};
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota == "NP") {
        continue;
      }
      var convocatoria = nota.convocatoria;
      if (!(convocatoria in datosConvocatorias)) {
        datosConvocatorias[convocatoria] = {alumnos: 0, sumaNotas: 0};
      }
      datosConvocatorias[convocatoria].alumnos += 1;
      datosConvocatorias[convocatoria].sumaNotas += parseFloat(nota.nota);
    }
    var resultado = {};
    for (var convocatoria in datosConvocatorias) {
      resultado[convocatoria] = datosConvocatorias[convocatoria].sumaNotas / datosConvocatorias[convocatoria].alumnos;
    }
    return resultado;
  }

  getDatosPorGenero(data) {
    var datosGenero = {Hombre: {count: 0, suma: 0}, Mujer: {count: 0, suma: 0}};
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota == "NP") {
        continue;
      }
      datosGenero[nota.genero].count += 1;
      datosGenero[nota.genero].suma += parseFloat(nota.nota);
    }
    var result = {};
    for (var genero in datosGenero) {
      var count = datosGenero[genero].count;
      result[genero] = count != 0 ? datosGenero[genero].suma / count : count;
    }
    return result;
  }
}

module.exports = CourseStatistics;
