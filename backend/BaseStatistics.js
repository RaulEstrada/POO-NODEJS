class BaseStatistics {

  getNotaAlfabetica(notaDecimal) {
    if (notaDecimal >= 9) {
      return "Sobresaliente";
    } else if (notaDecimal >= 7) {
      return "Notable";
    } else if (notaDecimal >= 5) {
      return "Aprobado";
    } else {
      return "Suspenso";
    }
  }

  getDatosMedia(data) {
    var sumaNotas = 0;
    var countAlumnos = 0;
    for (var notaData in data) {
      var nota = data[notaData];
      if (nota.nota != "NP") {
        sumaNotas += parseFloat(nota.nota);
        countAlumnos += 1;
      }
    }
    var resultado = 0;
    if (countAlumnos != 0) {
      resultado = sumaNotas / countAlumnos;
    }
    return resultado;
  }
}

module.exports = BaseStatistics;
