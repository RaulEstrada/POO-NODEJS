$(document).ready(function() {
  $.ajax({
        url: "http://156.35.98.14:3000/estudiantes",
        type: "get",
        dataType: 'jsonp',
        jsonpCallback: 'parseResponse',
    });
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

function crearGraficoGenero(estudiantes) {
  var estadisticas = {1: 0, 2: 0};
  for (var indx = 0; indx < estudiantes.length; indx++) {
    var estudiante = estudiantes[indx];
    estadisticas[estudiante.gender] += 1;
  }
  var data = [
    {x: '1', key: "1: " + estadisticas[1], y: estadisticas[1]},
    {x: '2', key: "2: " + estadisticas[2], y: estadisticas[2]}
  ];
  var barchart = new proteic.Barchart(data);
  barchart.draw();
}

function crearGraficoEdad(estudiantes) {
  var estadisticas = {"70": {1: 0, 2: 0}, "75": {1: 0, 2:0}, "80": {1: 0, 2:0}, "85": {1:0, 2:0}, "90": {1:0, 2:0}};
  for (var indx = 0; indx < estudiantes.length; indx++) {
    var estudiante = estudiantes[indx];
    var fecha = estudiante.dateOfBirth.split("-");
    var year = fecha[fecha.length-1];
    if (year <= 1970) {
      estadisticas["70"][estudiante.gender] += 1;
    } else if (year <= 1975) {
      estadisticas["75"][estudiante.gender] += 1;
    } else if (year <= 1980) {
      estadisticas["80"][estudiante.gender] += 1;
    } else if (year <= 1985) {
      estadisticas["85"][estudiante.gender] += 1;
    } else {
      estadisticas["90"][estudiante.gender] += 1;
    }
  }

  var data = [
        {'key': 'Hombre', x: '31/12/70', y:estadisticas["70"][1]},
        {'key': 'Mujer', x: '31/12/70', y:estadisticas["70"][2]},
        {'key': 'Hombre', x: '31/12/75', y:estadisticas["75"][1]},
        {'key': 'Mujer', x: '31/12/75', y:estadisticas["75"][2]},
        {'key': 'Hombre', x: '31/12/80', y:estadisticas["80"][1]},
        {'key': 'Mujer', x: '31/12/80', y:estadisticas["80"][2]},
        {'key': 'Hombre', x: '31/12/85', y:estadisticas["85"][1]},
        {'key': 'Mujer', x: '31/12/85', y:estadisticas["85"][2]},
        {'key': 'Hombre', x: '31/12/99', y:estadisticas["90"][1]},
        {'key': 'Mujer', x: '31/12/99', y:estadisticas["90"][2]}
      ];
        var stackedArea = new proteic.StackedArea(data, {
          xAxisLabel: 'Date'
        });
        stackedArea.draw();
}
