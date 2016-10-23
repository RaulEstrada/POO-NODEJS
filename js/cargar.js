$(document).ready(function() {
  $("#dialog").dialog({
      modal: true,
      autoOpen: false,
      width: 500,
      height: 400
    });
});

function subirEstudiantes(event) {
  event.preventDefault();
  var data = new FormData();
  var dialog = $("#dialog");
  dialog.html("");
  data.append("ficheroEstudiantes", $("#ficheroEstudiantes").prop('files')[0]);
  $.ajax({
    url: "http://156.35.98.14:3000/estudiantes",
    method: "post",
    cache: false,
    contentType: false,
    processData: false,
    data: data
  }).done(function(data) {
    var msg = "Alumnos añadidos.";
    if (data.error && data.error != "") {
      msg = data.error;
    }
    dialog.append($("<p>" + msg + "</p>"));
    dialog.dialog("open");
  }).fail(function(data) {
    dialog.append($("<p>FAILED. " + data.error + "</p>"));
    dialog.dialog("open");
  });
}

function subirNotas(event) {
  event.preventDefault();
  var data = new FormData();
  var dialog = $("#dialog");
  dialog.html("");
  data.append("ficheroConvocatoria", $("#ficheroConvocatoria").prop('files')[0]);
  $.ajax({
    url: "http://156.35.98.14:3000/convocatorias",
    method: "post",
    cache: false,
    contentType: false,
    processData: false,
    data: data
  }).done(function(data) {
    displaySubirNotasResult(data);
    dialog.dialog("open");
  }).fail(function(data) {
    dialog.append($("<p>FAILED</p>"));
    dialog.dialog("open");
  });
}

function displaySubirNotasResult(data) {
  var dialog = $("#dialog");
  dialog.append("<p>Notas subidas.</p>")
  procesarErroresEstudiantesMissing(data, dialog);
  procesarErroresNotasInvalidas(data, dialog);
  procesarErroresNotasRepetidas(data, dialog);
  procesarErrorCursoRepetido(data, dialog);
}

function procesarErroresEstudiantesMissing(data, dialog) {
  if (data.errorEnrollment && data.errorEnrollment.length > 0) {
    dialog.empty();
    var msg = "<p>" + data.errorEnrollment + "</p>";
    dialog.append(msg);
  }
}

function procesarErroresNotasInvalidas(data, dialog) {
  if (data.errorInvalidGrade && data.errorInvalidGrade.length > 0) {
    dialog.empty();
    var msg = "<p>Error. Las siguientes notas son inválidas y no se procesa el fichero:</p><ul>";
    for (var errMsg in data.errorInvalidGrade) {
      msg = msg + "<li>" + data.errorInvalidGrade[errMsg] + "</li>";
    }
    msg = msg + "</ul>";
    dialog.append(msg);
  }
}

function procesarErroresNotasRepetidas(data, dialog) {
  if (data.errorsRepeatedGrades && data.errorsRepeatedGrades.length > 0) {
    dialog.empty();
    var msg = "<p>Se han encontrado notas repetidas y no se procesa el fichero:</p><ul>";
    for (var indx = 0; indx < data.errorsRepeatedGrades.length; indx++) {
      var errorNota = data.errorsRepeatedGrades[indx];
      msg = msg + "<li>" + errorNota + "</li>";
    }
    msg = msg + "</ul>";
    dialog.append(msg);
  }
}

function procesarErrorCursoRepetido(data, dialog) {
  if (data.errorCourse && data.errorCourse != '') {
    dialog.empty();
    var msg = "<p>El curso ya se había subido anteriormente. No se han registrado las notas</p>";
    dialog.append(msg);
  }
}

function hacerReset(event) {
  event.preventDefault();
  var dialog = $("#dialog");
  dialog.html("");
  $.ajax({
    url: "http://156.35.98.14:3000/clean",
    type: "post",
    method: "post",
  }).done(function(data) {
    dialog.append($("<p>" + data.message + "</p>"));
    dialog.dialog("open");
  }).fail(function(data) {
    dialog.append($("<p>FAILED</p>"));
    dialog.dialog("open");
  });
}

function resetResponse(data) {
  var dialog = $("#dialog");

}
