$(document).ready(function() {
  $.ajax({
        url: "http://156.35.98.14:3000/estudiantes",
        type: "get"
    }).done(parseResponse);
  $.ajax({
    url: "http://156.35.98.14:3000/cursos",
    type: "get"
  }).done(parseCursosResponse);
});

function parseResponse(json) {
  var tablaEstudiantes = $("#estudiantes tbody");
  for(var indx = 0; indx < json.students.length; indx++) {
    var estudiante = json.students[indx];
    var row = $("<tr><td>" + estudiante.id + "</td><td>" + estudiante.name +
     "</td><td>" + estudiante.surname + "</td><td>" + estudiante.dateOfBirth +
     "</td><td>" + estudiante.gender + "</td></tr>");
    tablaEstudiantes.append(row);
  }
  crearGraficoGenero(json.students);
  crearGraficoEdad(json.students);
}

function parseCursosResponse(json) {
  var tablaCursos = $("#cursos tbody");
  for(var indx = 0; indx < json.courses.length; indx++) {
    var curso = json.courses[indx];
    var row = $("<tr><td>" + curso.id + "</td><td>" + curso.course + "</td></tr>");
    tablaCursos.append(row);
  }
}

function crearGraficoGenero(estudiantes) {
  var estadisticas = {'Hombre': 0, 'Mujer': 0};
  for (var indx = 0; indx < estudiantes.length; indx++) {
    var estudiante = estudiantes[indx];
    estadisticas[estudiante.gender] += 1;
  }
  var gaugeHombre = new proteic.Gauge([{x: estadisticas['Hombre']}], {
     minLevel: 0,
     maxLevel: estudiantes.length,
     ticks: 10,
     selector: '#generoChart',
     label: 'Hombres',
     width: '45%'
   });
  gaugeHombre.draw();
  var gaugeMujer = new proteic.Gauge([{x: estadisticas['Mujer']}], {
      minLevel: 0,
      maxLevel: estudiantes.length,
      ticks: 10,
      selector: '#generoChart',
      label: 'Mujeres',
      width: '45%'
  });
  gaugeMujer.draw();
}

function crearGraficoEdad(estudiantes) {
  var estadisticas = {};
  for (var indx = 0; indx < estudiantes.length; indx++) {
    var estudiante = estudiantes[indx];
    var fecha = estudiante.dateOfBirth.split("-");
    var year = fecha[fecha.length-1];
    if (!estadisticas[year]) {
      estadisticas[year] = {'Hombre': 0, 'Mujer': 0};
    }
    estadisticas[year][estudiante.gender] += 1;
  }
  var dataArea = [];
  for (var year in estadisticas) {
    dataArea.push({key:'Hombre', x:year, y:estadisticas[year]['Hombre']});
    dataArea.push({key:'Mujer', x:year, y:estadisticas[year]['Mujer']});
  }
  areaLinechart = new proteic.Linechart(dataArea, {
      selector: '#edadChart',
      area: true,
      width: '90%',
      height: 400
  });
  areaLinechart.draw();
}
