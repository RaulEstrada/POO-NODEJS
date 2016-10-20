$(document).ready(function() {
  $.ajax({
        url: "http://localhost:3000/estudiantes",
        type: "get",
        crossDomain: true
    }).done(function(data) {
      var json = JSON.parse(data);
      var tablaCursos = $("#cursos tbody");
      for(var indx = 0; indx < json.cursos.length; indx++) {
        var curso = json.cursos[indx];
        var row = $("<tr><td>" + curso.id + "</td><td>" + curso.curso + "</td></tr>");
        tablaCursos.append(row);
      }
      var tablaEstudiantes = $("#estudiantes tbody");
      for(var indx = 0; indx < json.estudiantes.length; indx++) {
        var estudiante = json.estudiantes[indx];
        var row = $("<tr><td>" + estudiante.id + "</td><td>" + estudiante.nombre +
         "</td><td>" + estudiante.apellidos + "</td><td>" + estudiante.fecha_nacimiento +
         "</td><td>" + estudiante.genero + "</td></tr>");
        tablaEstudiantes.append(row);
      }
      crearGraficoGenero(json.estudiantes);
      crearGraficoEdad(json.estudiantes);
    });
});

function crearGraficoGenero(estudiantes) {
  var estadisticas = {1: 0, 2: 0};
  for (var indx = 0; indx < estudiantes.length; indx++) {
    var estudiante = estudiantes[indx];
    estadisticas[estudiante.genero] += 1;
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
    var fecha = estudiante.fecha_nacimiento.split("-");
    var year = fecha[fecha.length-1];
    if (year <= 1970) {
      estadisticas["70"][estudiante.genero] += 1;
    } else if (year <= 1975) {
      estadisticas["75"][estudiante.genero] += 1;
    } else if (year <= 1980) {
      estadisticas["80"][estudiante.genero] += 1;
    } else if (year <= 1985) {
      estadisticas["85"][estudiante.genero] += 1;
    } else {
      estadisticas["90"][estudiante.genero] += 1;
    }
  }

  var data = [
        {'key': 'Hombre', x: '31/12/1970', y:estadisticas["70"][1]},
        {'key': 'Mujer', x: '31/12/1970', y:estadisticas["70"][2]},
        {'key': 'Hombre', x: '31/12/1975', y:estadisticas["75"][1]},
        {'key': 'Mujer', x: '31/12/1975', y:estadisticas["75"][2]},
        {'key': 'Hombre', x: '31/12/1980', y:estadisticas["80"][1]},
        {'key': 'Mujer', x: '31/12/1980', y:estadisticas["80"][2]},
        {'key': 'Hombre', x: '31/12/1985', y:estadisticas["85"][1]},
        {'key': 'Mujer', x: '31/12/1985', y:estadisticas["85"][2]},
        {'key': 'Hombre', x: '31/12/1999', y:estadisticas["90"][1]},
        {'key': 'Mujer', x: '31/12/1999', y:estadisticas["90"][2]}
      ];
        var stackedArea = new proteic.StackedArea(data, {
          xAxisLabel: 'Date'
        });
        stackedArea.draw();
}
