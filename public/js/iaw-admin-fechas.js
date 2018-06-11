var jornadaActual = 1;

function abrirJornadas() {

  $.get("/api/fechas", function(data, status) {
    if(!jQuery.isEmptyObject(data))   
      mostrarCalendarioCompleto(data);
    else{
      var row = $("<tr></tr>").attr("scope", "row").append($("<td></td>").text("No se ha generado el fixture").attr("colspan", "8").css("font-size",  "20px"));
      $("#tabla_fixture").append(row);
      $('#btn_jornada_anterior').css('visibility', 'hidden');
      $('#btn_jornada_siguiente').css('visibility', 'hidden');
    }
  });

}

//Muestra el calendario completo si es que ya fue generado
function mostrarCalendarioCompleto(data) {

  var pxJornada;
  $.get("/api/fechas", function(data, status) {

    $.each(data, function (i, jornada) {
      if (jornada.numero === jornadaActual) {
        pxJornada = jornada;
      }
    });

    if(pxJornada !== undefined){
        $("#nroJornada").text("Jornada " + pxJornada.numero);
        mostrarJornadaEnTabla(pxJornada.partidos, pxJornada.numero);
    }

  });
 
}

//Cambia de jornada según el boton seleccionado
function buscarJornada(event) {

//Saco el número de la jornada que está mostrando cuando tocó el boton.
var nroJornadaActual = $("#nroJornada").text().trim();
var nro = parseInt(nroJornadaActual.substring(8, nroJornadaActual.length));
if (event.id === "btn_jornada_siguiente") {
  obtenerJornada(nro + 1);
} else {
  obtenerJornada(nro - 1);
}
}

function obtenerJornada(nro) {
  var j;

  $.get("/api/fechas", function(data, status) {

   $.each(data, function (i, jornada) {
    if (jornada.numero === nro) {
      j = jornada;
    }
  });

   if (j !== undefined) {
    $("#nroJornada").text("Jornada " + j.numero);

    $("#tabla_fixture").empty();

    if (nro === 1)
      $("#btn_jornada_anterior").css("visibility", "hidden");
    else
      $("#btn_jornada_anterior").css("visibility", "visible");

    if (nro === 38)
      $("#btn_jornada_siguiente").css("visibility", "hidden");
    else
      $("#btn_jornada_siguiente").css("visibility", "visible");

    mostrarJornadaEnTabla(j.partidos, nro);
  }



});

}

//Rellena la tabla con los partidos correspondientes de una jornada
function mostrarJornadaEnTabla(partidos, numero){


  for (index = 0; index < partidos.length; index++) {

    var row = $("<tr></tr>").attr("scope", "row");
    row.append($("<td></td>").text(partidos[index].fecha));
    row.append($("<td></td>").text(partidos[index].horario));
    row.append($("<td></td>").text(partidos[index].equipo_local));

    var resultado = partidos[index].resultado;


    if (resultado === "vs")
      row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(resultado)));
    else{
      var RL = resultado.substring(0, 1);
      var RV = resultado.substring(1, 2);
      row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(RL + " - " + RV)));
    }


    row.append($("<td></td>").text(partidos[index].equipo_visitante));
    row.append($("<td></td>").attr("class", "tabla-estadio").text(partidos[index].estadio));
    row.append($("<td></td>").attr("class", "tabla-arbitro").text(partidos[index].editor));


    var idPartido = partidos[index].id_partido;

    row.append($("<td></td>").append($("<span></span>").attr("id", "btn_editar_partido"+ index).attr("class", "oi oi-pencil").attr("onclick", "editarPartido('"+ idPartido + "'," + numero+ "," + index + ");")));

    $("#tabla_fixture").append(row);

  }

  if(numero === 1)
    $("#btn_jornada_anterior").css('visibility', 'hidden');
}

//Ordena los partidos por jornada
function ordenarJornadas(data) {

  var jornadas = new Array();

  $.each(data, function (i, obj) {
    jornadas[jornadas.length] = obj;
  });

  var index;
  var j = new Object(); 
  var jActual = jornadas[jornadaActual - 1].partido;
  $("#num-jornada").html("Jornada " + jornadas[jornadaActual - 1].numero);
  for (index = 0; index < jActual.length; ++index) {
    var partido = jActual[index];
    var partidosPorDia;
    if (j.hasOwnProperty(partido.fecha))
      partidosPorDia = j[partido.fecha];
    else {
      partidosPorDia = new Array();
      j[partido.fecha] = partidosPorDia;
    }
    partidosPorDia[partidosPorDia.length] = partido;
  }
  return j;
}

//Muestra los inputs necesarios para modificar una jornada
function editarPartido(id, jornada, nroFila){

  $('#btn_editar_partido'+nroFila).css("color", "#00cc00");

  var col = $('#tabla_fixture tr:eq('+nroFila+')').attr("id", "tr_partido"+nroFila);
  var celda = $(col).children('td:nth-child(1)')[0];  
  var fecha = $(celda).html();

  $(celda).html($("<input></input>").attr("type", "text").attr("onfocus", "(this.type='date')").attr("onblur", "(this.type='text')").attr("id", "input_fecha"+nroFila).val(fecha));
  celda = $(col).children('td:nth-child(2)')[0];  

  var hora = $(celda).html();
  $(celda).html($("<input></input>").attr("type", "time").attr("id", "input_hora"+nroFila).val(hora));

  celda = $(col).children('td:nth-child(6)')[0];  

  var estadio = $(celda).html();
  $(celda).html($("<input></input>").attr("type", "text").attr("id", "input_estadio"+nroFila).val(estadio));

  celda = $(col).children('td:nth-child(7)')[0];  

  var editor = $(celda).html();
  var select = $(celda).html($("<select></select>").attr("id", "input_editor"+nroFila).attr("name", "editor_fecha").attr("text", editor));

  $.get("/api/users", function(objeto, status) {
    $("#input_editor"+nroFila).append($("<option></option>").html("No Asignado"));
   $.each(objeto, function (i, ed) {
    if(ed.google.name === editor)
      $("#input_editor"+nroFila).append($("<option selected></option>").html(ed.google.name));
    else{
      if(ed.editor)
        $("#input_editor"+nroFila).append($("<option></option>").html(ed.google.name));
    }

  });


 });

  $("#btn_editar_partido"+ nroFila).attr("class", "oi oi-check").attr("onclick", "guardar_cambios_partido('"+id +"',"+ jornada +"," + nroFila +",'"+fecha+"');");


}

//Chequea que una fecha sea correcta
 function checkDate(nroFila, fVieja) {
   var nuevaFecha = $('#input_fecha'+nroFila).val();

    if (nuevaFecha.indexOf('/') !== -1) {
      var f = parsearFecha(nuevaFecha);
    }

    else{
      var f = nuevaFecha;
    }
  
   var fechaVieja = parsearFecha(fVieja);

   if (new Date(f) < new Date(fechaVieja)){
       $('#input_fecha'+nroFila).css("border-color", "#dc3545");
       return false;
   }
   else
       return true;

 }

 //Formatea una fecha
 function parsearFecha(fecha){
    const year = fecha.substring(6,10);
    let mes = fecha.substring(3,5);
    let dia = fecha.substring(0,2);

    return year+"-"+mes+"-"+dia;
 }


//Elimina los inputs y agrega los valores correspondientes a cada campo
function guardar_cambios_partido(id, jornada, nf, fechaVieja){

  var execute = true;

  var nuevaFecha = $("#input_fecha"+nf).val();
  var estadio = $("#input_estadio"+nf).val();
  var editor = $("#input_editor"+nf).val();
  var hora = $("#input_hora"+nf).val();

  if (nuevaFecha == ""){
    $("#input_fecha"+nf).css("border", "2px solid red");
    execute = false;
    $("#input_fecha"+nf).effect("shake", {times: 2, distance: 5}, 500);
  } else {$("#input_fecha"+nf).css("border", "2px solid green");}

  if (estadio == ""){
    $("#input_estadio"+nf).css("border", "2px solid red");
    execute = false;
    $("#input_estadio"+nf).effect("shake", {times: 2, distance: 5}, 500);

  } else {$("#input_estadio"+nf).css("border", "2px solid green");}

  if (hora == ""){
    $("#input_hora"+nf).css("border", "2px solid red");
    execute = false;
    $("#input_hora"+nf).effect("shake", {times: 2, distance: 5}, 500);
  } else {$("#input_hora"+nf).css("border", "2px solid green");}

  if (nuevaFecha.indexOf('-') !== -1) {
    const year = nuevaFecha.substring(0,4);
    let mes = nuevaFecha.substring(5,7);
    let dia = nuevaFecha.substring(8,10);


    if (mes.length < 2) 
      month = '0' + month;
    if (dia.length < 2) 
      day = '0' + day;

    var f = dia + "/" + mes + "/" + year;
  }

  else{
    var f = nuevaFecha;
  }


  //Si la fecha es correcta, reemplazo los inputs y hago el post.
  if (checkDate(nf, fechaVieja)){
    if (execute === true){
      $('#input_fecha'+nf).replaceWith(f);
      $('#input_estadio'+nf).replaceWith(estadio);
      $('#input_hora'+nf).replaceWith(hora);
      $('#input_editor'+nf).replaceWith(editor);
      $("#btn_editar_partido"+ nf).attr("class", "oi oi-pencil").attr("onclick", "editarPartido('"+id +"',"+ jornada +"," + nf + ");");
      $('#btn_editar_partido'+nf).css("color", "black");

      $.post('/editarPartido', {
         _token: $('meta[name=csrf-token]').attr('content'),
         numero: jornada,
         fecha: f,
         hora: hora,
         estadio: estadio,
         id: id,
         editor: editor
        }
       )
        .done(function(datos) {
            toastr.success("Partido modificado");
        })
      }
  }
  else{
     toastr.error("Ingrese una fecha correcta");
  }
}


//Chequea que los equipos cuenten con los jugadores necesarios , genera el fixture y realiza el post de las fechas
function genfix(){

  $.get("/api/configuracion", function(objeto, status) {

    var cant_jug = objeto[0].cant_jugadores;
    var equipos_incorectos = "";

    var data;   
    $.get("/api/equipos", function(objeto, status) {

      var arr = [];
      var salir = false;
      $.each(objeto, function (i, equipo) {
        arr[equipo.nombre_equipo] = equipo.estadio;
        if (equipo.jugadores.length < cant_jug){
          equipos_incorectos += "- "+equipo.nombre_equipo+"<br>";
          salir = true;
        }
      });

      if (salir){
        toastr.error("Verifique la cantidad de jugadores de estos equipos:"+"<br>"+equipos_incorectos);
        return false;
      }

      $.confirm({
        animation: 'zoom',
        closeAnimation: 'scale',
        title: '¿Generar Fixture?',
        content: 'No podrá modificar los participantes ni las opciones del torneo luego de generado el fixture',
        buttons: {
          cancelar:{ 
            btnClass: 'btn-danger',
            action: function () {}
          },
          Aceptar: {
            btnClass: 'btn-success',
            action:  function () {                          

              toastr.warning("Espere unos segundos mientras se genera el fixture");

              //Arma el fixture
              data = fix(objeto); 
              fixture = fixVuelta(data);

              var i, j;
              var id = 0;
              var successCount = 0;
              for(i = 0; i< fixture.length; i++){
                var fecha = fixture[i][0];
                var fechaCompleta = new Array();
                for(j = 0; j< fixture[0][0].length; j++){

                  var partido = fixture[i][0][j];

                  var datos = {"id_partido": id+"" ,"equipo_local": partido[0], "equipo_visitante": partido[1], "fecha": partido.fecha, "horario": partido.horario, "estadio": arr[partido[0]], "resultado": 'vs', "editor": "No Asignado"};
                  fechaCompleta.push(datos);
                  id++;
                }

                $.post('/armarFixture', {
                 _token: $('meta[name=csrf-token]').attr('content'),
                 numero: i+1,
                 partidos: fechaCompleta
               }
               )
                .done(function(datos) { 
                  successCount++;
                  if (successCount == fixture.length)  {
                   toastr.success("Fixture Armado");
                   $("#lista-equipos").children('a:last').remove();
                   bloquearEquipos();
                   bloquearJugadores();
                 }         
               })
              }
            }
          }
        }
      }); 

    }); 
  });
}

//Borra los botones para eliminar equipos
function bloquearEquipos(){
  $($("#lista-equipos")[0]).children('div').each(function () {
      var obj = $(this)[0];
      var a = ($(this).children(1)[1]);
      a.remove();
  });
}

//Borra los botones para eliminar jugadores
function bloquearJugadores(){
  $("#lista_jugadores tr:last-child").remove();
  $("#lista_jugadores tr:last-child").css("color", "#343a40");
  $($("#lista_jugadores")[0]).children('tr').each(function () {
    var tr = ($(this).children(1)[5]);
    tr.remove();
    $("#col_eliminar").remove();
  });
}

//Auxiliar para fixture
function convertir(fixture){

  var i, j;
  var jornada, partidos, juego;
  var fix = new Array();
  for (i = 0; i < fixture.length; i++){
    jornada = '{"numero": '+(i+1)+',';
    partidos = '"partidos" : [';
    for(j = 0; j < fixture[0][0].length; j++){
      var partido = fixture[i][0][j];


      juego = "{\"id_partido\":" + j + ", \"fecha\":" + partido.fecha + ", \"horario\":" + partido.horario+ ", ";
      juego += "\"equipo_local\": " + partido[0]+ ", \"equipo_visitante\":" +  partido[1]+ ", \"estadio\": \"Estadio 1\", \"resultado\": \"--\"}";
      partidos += juego;
      if(j < fixture[0][0].length - 1)
        partidos = partidos + ",";
      juego = "";
    }
    partidos += "]";

    jornada += partidos;

    jornada += "}";

    if(i < fixture.length)
      jornada += ",";

    fix.push(jornada);
    jornada = "";
    partidos = "";
  }

  return fix;
}

var fecha;

function getFecha(){
    $.get("/api/configuracion", function(data, status){
      fecha = data[0].fecha;
    });
}


//Arma la segunda vuelta del fixture
function fixVuelta(jornadas){
    var arreglo;

    $.ajax({
      dataType: "json",
      url: "/api/configuracion",
      async: false, 
      success: function(data) {

          var cant = (data[0].equipos) - 1;
          var i,j,k;
          arreglo = new Array();
          for (i = 0; i < (jornadas.length*2); i++){
           if (i < cant)
            arreglo.push(jornadas[i]);
          else
            arreglo.push(vueltaJornada(jornadas[i-cant]));
        }

          var dd = parseInt(data[0].fecha.substring(0, 2));
          var mm = parseInt(data[0].fecha.substring(3, 5))-1;
          var aa = parseInt(data[0].fecha.substring(6, 10));

          var today = new Date(Date.UTC(aa, mm, dd, 0, 0, 0)).getTime();
          var semana = 86400000 * 5;
          var proxima = today;
          var hora = 14;
          var k = 0;
          for(i = 0; i < arreglo.length; i++){
            for(j = 0; j < arreglo[0][0].length; j++){

              if (k == 3){
                proxima+=86400000;
                k = 0;
                hora = 14;
              }
              else{
                k++; 
                hora+=2;
              }

              var proximaFecha = new Date(proxima);
              var day = ("0" + proximaFecha.getDate()).slice(-2);
              var month = ("0" + (proximaFecha.getMonth()+1)).slice(-2)

              var dia = day + '/' + month + '/' + proximaFecha.getFullYear();
              var horario = hora+':'+'00';
              arreglo[i][0][j].fecha = dia;
              arreglo[i][0][j].horario = horario;
            }
            proxima+=semana;

        }

        }
      });
     return arreglo;

}

//Auxiliar fixture
function vueltaJornada(jornadas){
  var arreglo = new Array();

  for (var i = 0; i < jornadas.length; i++){
    arreglo.push(new Array());

  }
  for (var i = 0; i < jornadas[0].length; i++){
    arreglo[0].push(intercambiar(jornadas[0][i]));
  }
  return arreglo;
}

//Auxiliar fixture
function fix(equipos){

  var n = equipos.length;
  var i, j, h;
  var jornadas = n - 1;
  var partidosXJornada = n / 2;
  var salida = new Array();

  for(h = 0; h < jornadas; h++){
    salida.push(new Array());
  }

  var local, visita;


  for(i = 0; i < jornadas; i++){
    for(j = 0; j < partidosXJornada; j++){
      local = (i + j) % (n - 1);
      visita = (n - 1 - j + i) % (n - 1);
      if ( j == 0)
        visita = n - 1;
      var par = [equipos[local].nombre_equipo, equipos[visita].nombre_equipo];

      salida[i].push(par);
    }
  }

     //Intercalar
     var intercalar = new Array();
     for (i = 0; i < jornadas; i++){
      intercalar.push(new Array());
    }

    var par = 0;
    var impar = n / 2;
    for (i = 0; i < salida.length; i++){
      if (i% 2 == 0)
        intercalar[i].push(salida[par++]);
      else
        intercalar[i].push(salida[impar++]);
    }

    salida = intercalar;

    for (i = 0; i < salida.length; i++){
      if (i % 2 == 1)
        salida[i][0][0] = intercambiar(salida[i][0][0]);
    }



    return salida;

  }

  //Auxiliar fixture
  function intercambiar(par){
    return [par[1], par[0]];
  }
