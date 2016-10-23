function consultarEstudiante(event) {
  event.preventDefault();
  var url = "http://156.35.98.14:3000/statistics/users/";
  var studentId = $("#estudianteID").val();
  if (studentId && studentId.trim() != "") {
    url = url + studentId;
  }
  $.ajax({
    url: url,
    type: "get"
  }).done(function(data) {
    crearGraficaEstudianteAsignaturas(data);
    crearGraficaEstudianteMedia(data, "#estudiantesMedias");
    crearGraficaEstudianteCurso(data);
    crearGraficaEstudianteNotaAlfabetica(data);
  }).fail(function(data) {
    alert("FAIL: " + data);
  });
}

function crearGraficaEstudianteAsignaturas(data) {
  $("#estudiantesAsignaturasMedias").html("");
  var datosAsignaturas = data.datosAsignaturas;
  var dataGrafica = [];
  for (var asignatura in datosAsignaturas) {
    dataGrafica.push({x: asignatura, key: asignatura, y: datosAsignaturas[asignatura]});
  }
  var barchartGrouped = new proteic.Barchart(dataGrafica, {
    selector: '#estudiantesAsignaturasMedias',
    stacked: false,
    xAxisLabel: 'Asignatura',
    yAxisLabel: 'Nota media',
    width: '60%'
  });
  barchartGrouped.draw();
}

function crearGraficaEstudianteMedia(data, selector) {
  $(selector).html("");
  var notaMedia = Math.round(data.notaMedia * 100) / 100;
  var gauge = new proteic.Gauge([{x: notaMedia}], {
     minLevel: 0,
     maxLevel: 10,
     ticks: 1,
     selector: selector,
     label: 'Nota media'
   });
  gauge.draw();
}

function crearGraficaEstudianteCurso(data) {
  $("#estudiantesCursoMedias").html("");
  var datosCursos = data.datosCursoAcademico;
  var dataGrafica = [];
  for (var curso in datosCursos) {
    var year = curso.split("-")[0].substring(2,4);
    dataGrafica.push({x: '01/01/' + year, key: 'Nota media', y: datosCursos[curso].toFixed(2)});
  }
  areaLinechart = new proteic.Linechart(dataGrafica, {
      selector: '#estudiantesCursoMedias',
      area: true,
      width: '70%',
      height: 400,
      xAxisType: 'time'
  });
  areaLinechart.draw();
  $("#estudiantesCursoMedias g.x g.tick text").attr("transform", "translate(0, 40),rotate(90)");
}

function crearGraficaEstudianteNotaAlfabetica(data) {
  $("#estudiantesNotasAlfabeticas").html("");
  var datosCursos = data.datosNotasNumericas;
  var dataGrafica = [{"id": "root", "parent": "", "value": "0", "label": "sequences"}];
  var indx = 0;
  for (var curso in datosCursos) {
    dataGrafica.push({id: indx, parent: "root", value: datosCursos[curso], label: curso});
    indx = indx + 1;
  }
  var sunburst = new proteic.Sunburst(dataGrafica, {
      selector: '#estudiantesNotasAlfabeticas'
  });
  sunburst.draw();
}

function consultarCurso(event) {
  event.preventDefault();
  var url = "http://156.35.98.14:3000/statistics/course/";
  var course = $("#cursoAcademico").val();
  if (course && course.trim() != "") {
    url = url + course;
  }
  $.ajax({
    url: url,
    type: "get"
  }).done(function(data) {
    crearGraficaCursoConvocatorias(data);
    crearGraficaEstudianteMedia(data, "#cursoMedias");
    crearGraficaCursoGenero(data);
  }).fail(function(data) {
    alert("FAIL: " + data);
  });
}

function crearGraficaCursoConvocatorias(data) {
  $("#cursoConvocatoriasMedias").html("");
  var datosConvocatorias = data.datosConvocatorias;
  var dataGrafica = [];
  for (var convocatoria in datosConvocatorias) {
    dataGrafica.push({x: convocatoria, key: 'Nota media', y: "" + datosConvocatorias[convocatoria].toFixed(2)});
  }
  areaLinechart = new proteic.Linechart(dataGrafica, {
      selector: '#cursoConvocatoriasMedias',
      area: true,
      width: '70%',
      height: 400,
      xAxisType: 'linear',
      xAxisLabel: 'Convocatoria'
  });
  areaLinechart.draw();
}

function crearGraficaCursoGenero(data) {
  $("#cursoMediasGenero").html("");
  var datosGenero = data.datosGenero;
  var dataGrafica = [];
  for (var genero in datosGenero) {
    dataGrafica.push({x: genero, key: genero + ": " + datosGenero[genero], y: datosGenero[genero]});
  }
  var barchartGrouped = new proteic.Barchart(dataGrafica, {
    selector: '#cursoMediasGenero',
    stacked: false,
    xAxisLabel: 'Género',
    yAxisLabel: 'Nota media',
    width: '60%'
  });
  barchartGrouped.draw();
}

function consultarAsignatura(event) {
  event.preventDefault();
  var url = "http://156.35.98.14:3000/statistics/asignatura/";
  var course = $("#asignaturaID").val();
  if (course && course.trim() != "") {
    url = url + course;
  }
  $.ajax({
    url: url,
    type: "get"
  }).done(function(data) {
    crearGraficaCursosConvocatoriasAsignatura(data);
    crearGraficaAsignaturaNotas(data);
  }).fail(function(data) {
    alert("FAIL: " + data);
  });
}

function crearGraficaCursosConvocatoriasAsignatura(data) {
  $("#asignaturaConvocatoriasMedias").html("");
  var datosAsignaturas = data.datosCursosMedia;
  var dataGrafica = [];
  for (var curso in datosAsignaturas) {
    var datosConvocatorias = datosAsignaturas[curso];
    for (var convocatoria in datosConvocatorias) {
      dataGrafica.push({x: convocatoria, key: curso + "(" + datosConvocatorias[convocatoria] + ")",
        y: "" + datosConvocatorias[convocatoria].toFixed(2)});
    }

  }
  areaLinechart = new proteic.Linechart(dataGrafica, {
      selector: '#asignaturaConvocatoriasMedias',
      area: true,
      width: '70%',
      height: 400,
      xAxisType: 'linear',
      xAxisLabel: 'Convocatoria'
  });
  areaLinechart.draw();
}

function crearGraficaAsignaturaNotas(data) {
  $("#asignaturaNotasAlfabeticas").html("");
  var datosCursos = data.cursosNotasAlfabeticas;
  var dataGrafica = [{"id": "root", "parent": "", "value": "0", "label": "sequences"}];
  var indx = 0;
  for (var curso in datosCursos) {
    var notas = datosCursos[curso];
    for (var nota in notas) {
      var parent = (indx == 0) ? "root" : Object.keys(datosCursos)[indx-1] + nota;
      dataGrafica.push({id: curso + nota, parent: parent, value: notas[nota], label: curso + "(" + nota + ")"});
    }
    indx += 1;
  }
  var sunburst = new proteic.Sunburst(dataGrafica, {
      selector: '#asignaturaNotasAlfabeticas'
  });
  sunburst.draw();
}
