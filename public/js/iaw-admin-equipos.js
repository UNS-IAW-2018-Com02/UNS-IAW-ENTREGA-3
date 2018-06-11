$("#lista-equipos").click(function(e){
    if (e.target.tagName === "DIV"){
      var div = e.target.children[0];
      mostrarJugadores($(div).text());
    }
    else if (e.target.tagName === "SPAN"){
      var span = e.target;
      mostrarJugadores($(span).text());
    }

});

    //Código para validar campos al agregar un jugador
    (function() {
      'use strict';
      window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('form-jugador');
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
              $("#modalJugador").effect("shake");
            }
            else{
              submitJugador();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();


    //Código para validar los campos al agregar un equipo
    (function(){
      'use strict';
      window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('form-equipo');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
              $("#modalEquipo").effect("shake");
            }
            else{
              submitEquipo();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();



  function abrirEquipos() {
    $.get("/api/equipos", function(data, status) {
       mostrarEquipos(data);
       if (!jQuery.isEmptyObject(data))
          mostrarJugadores(data[0].nombre_equipo);
    });
  }


//POST para agregar equipo nuevo y actualizar la lista de equipos
function submitEquipo() {
   var nom = $('#nombre_equipo').val();
   var est = $('#estadio_equipo').val();
   var mov = nom.substring(0, 3).toUpperCase();

   var esc = $('#lbl_escudo').text();
   event.preventDefault(); // Stops browser from navigating away from page
   var data = { "nombre_equipo" : nom, "nombre_equipo_movil": mov, "escudo": "../images/"+esc};
   var form = new FormData($("#form_equipo")[0]);

   $.ajax({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }, 
    type        : 'POST',
    url         : "/nuevoEquipo", 
    data        :  form,
    contentType:false,
    processData:false,
  })
   .done(function(datos,status){
    if (datos.respuesta == 'Exito'){
      agregarEquipo(data);
      toastr.success("Equipo agregado");
      $('#lbl_escudo').text("");
      $('#lbl_escudo').hide();
      $('#escudo_equipo').val('');
    }
    else{
      toastr.error("Ya existe un equipo con ese nombre");
    }

  });

 }


//POST para agregar un jugador nuevo y actualizar la lista de jugadores
function submitJugador(){
  var nom_equipo = $("#modal_equipo_jugador").val();
  var nom_jugador = $('#nombre-jugador').val();
  var nac = $('#nacionalidad-jugador').val();
  var dor = $('#dorsal-jugador').val();
  var pos = $('#posicion-jugador').val();
  var age = calcularEdad($('#fecha-jugador').val());
  event.preventDefault(); // Stops browser from navigating away from page
  var data = { "nombre_equipo" : nom_equipo, "nombre_jugador" : nom_jugador, "nacionalidad" : nac, "dorsal" : dor, "posicion" : pos, "edad": age };
  
  if (age < 14)
    toastr.error("El jugador debe tener al menos 14 años");

  else{
    if (age > 60)
       toastr.error("El jugador debe tener menos de 60 años");
      //Chequeo que la fecha no sea menor al dia actual
    else if (checkDate()){
          $.post('/nuevoJugador', {
             _token: $('meta[name=csrf-token]').attr('content'),
             nombre_equipo: nom_equipo,
             nombre_jugador: nom_jugador,
             nacionalidad: nac,
             dorsal: dor,
             posicion: pos,
             edad: age
            }
           )
           .done(function(datos) {
              if (datos.respuesta === 'Exito'){
                agregarJugador(data);
                toastr.success("Jugador agregado");
              }
              else{
                toastr.error("Ya existe un jugador con ese dorsal");
              }
          })
         }
         else{
          toastr.error("Ingrese una fecha correcta");
         }
    }
 }

 function checkDate() {
   var selectedText = $('#fecha-jugador').val();
   var selectedDate = new Date(selectedText);
   var now = new Date();
   if (selectedDate >= now) {
    $('#fecha-jugador').css("border-color", "#dc3545");
    return false;
   }
   $('#fecha-jugador').css("border-color", "#28a745");
   return true;
 }

function agregarEquipo(equipo){
   $('#lista-equipos').children().last().remove();
   addTeam(equipo);
   chequearEquipos();
}

//Agrega un equipo a la lista
  function addTeam(equipo, i, fix){
    img = equipo.escudo;
    var row = $("<span></span>").text(equipo.nombre_equipo).attr("id", equipo.nombre_equipo).append($("<img>").attr("src", img).attr("class", "escudo tabla-equipos").attr("align", "left"));
    if (!fix){
      var btnEliminar = $("<a></a>").attr("class", "oi oi-x float-right").attr("id", "eliminar_equipo").attr("onclick", "eliminarEquipo('"+ equipo.nombre_equipo +"')");
    }
    if (i != 0) 
        var div = $("<div></div>").attr("id", "equipo-lista"+i).attr("class", "list-group-item list-group-item-action").attr("data-toggle", "list").attr("href", "#lista_jugadores").attr("role", "tab").append(row).append(btnEliminar);
    else
        var div = $("<div></div>").attr("id", "equipo-lista"+i).attr("class", "list-group-item list-group-item-action active").attr("data-toggle", "list").attr("href", "#lista_jugadores").attr("role", "tab").append(row).append(btnEliminar);

    $("#lista-equipos").append(div);
                                                                    
}
  //Hace el request para eliminar el equipo de la BD
  function eliminarEquipo(nombre){
    
    $.confirm({
      animation: 'zoom',
      closeAnimation: 'scale',
      title: 'Eliminar '+nombre,
      content: '¿Está seguro que desea eliminarlo?',
      buttons: {
        cancelar:{ 
          btnClass: 'btn-danger',
          action: function () {}
        },
         Aceptar: {
            btnClass: 'btn-success',
            action:  function () {              
                          $.post('/eliminarEquipo', {
                           _token: $('meta[name=csrf-token]').attr('content'),
                           nombre_equipo: nombre,
                           }
                          )
                         .done(function(datos) {
                            eliminarEquipoLista(nombre);
                            eliminarJugadores();
                            ejecutarToast(nombre+" eliminado");
                            chequearEquipos();
                          })
                           .fail(function() {
                          });
                      }
          }
    }
    });    
  }

//Vacia la lista de jugadores luego de borrar equipo
function eliminarJugadores(){
    $("#lista_jugadores").empty();
    var row = $("<tr></tr>").attr("scope", "row");
    row.append($("<td></td>").text("No hay jugadores para mostrar.").attr("colspan", "6"));
    $("#lista_jugadores").append(row);
}  

//Elimina el equipo de la lista
function eliminarEquipoLista(nombre){

    $('#lista-equipos').children().last().remove();
    $($("#lista-equipos")[0]).children('div').each(function () {
      var obj = $(this)[0];
      var a = ($(this).children(0)[0]);
      if($(a).text() === nombre){
        $(obj).remove();
        return true;
      }
    });
}

  function mostrarEquipos(data) {

    var objeto = data;
    //Ordena los equipos
    objeto.sort(
      function (a, b) {
        if (a.nombre_equipo > b.nombre_equipo)
          return 1;
        else
          return -1;
      }
    );


   $.get("/api/fechas", function(data, status){
      if(!jQuery.isEmptyObject(data)){
        $.each(objeto, function (i, equipo) {
          addTeam(equipo, i, true);
        });
      }
      else{
        $.each(objeto, function (i, equipo) {
          addTeam(equipo, i, false);
        });
      }
    }); 

    chequearEquipos();
  }


//Arma la lista de jugadores de un equipo
function mostrarJugadores(n) {

 $("#modal_equipo_jugador").val(n);

 $.get("/api/equipos", function(objeto, status) {

   $.each(objeto, function (i, equipo) {
    if (equipo.nombre_equipo === n) {
      $("#lblJugadores").text("Jugadores");
      $("#lista_jugadores tr").remove();
      if (equipo.jugadores.length === 0 || equipo.jugadores === undefined) {
        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text("No hay jugadores para mostrar.").attr("colspan", "6"));
        $("#lista_jugadores").append(row);
      }
      

       $.get("/api/fechas", function(data, status){
        if(!jQuery.isEmptyObject(data)){
            $("#col_eliminar").remove();
            $.each(equipo.jugadores, function (j, jugador) {
              addPlayer(jugador,true);
            });
            $("#lista_jugadores tr:last-child").css("color", "#343a40");

        }
        else{
            $.each(equipo.jugadores, function (j, jugador) {
             addPlayer(jugador, false);
           });
           var rowfinal = $("<tr></tr>");
           rowfinal.append($("<td></td>").text("+").attr("colspan", "6").attr("class", "bg-danger").attr("id", "boton-agr-jugador").attr("data-toggle", "modal").attr("data-target", "#modalJugador"));
           $("#lista_jugadores").append(rowfinal); 
         }

        $("#tabla_jugadores").show();

      });     

      return false;
    }
  });       

 });    

}


//Agrega un jugador a la tabla y un boton para agregar otro jugador
function agregarJugador(data){

 $('#tabla_jugadores tr:last').remove();
 var t = $('#tabla_jugadores tr:last td:first-child').html();
 if (t === "No hay jugadores para mostrar.")
  $('#tabla_jugadores tr:last').remove();

  addPlayer(data);

   $.get("/api/fechas", function(data, status){
          if(jQuery.isEmptyObject(data)){             
              var rowfinal = $("<tr></tr>");
              rowfinal.append($("<td></td>").text("+").attr("colspan", "6").attr("class", "bg-danger").attr("id", "boton-agr-jugador").attr("data-toggle", "modal").attr("data-target", "#modalJugador"));
              $("#lista_jugadores").append(rowfinal);
            }
    });
         
}



//Agrega un jugador a la lista
function addPlayer(jugador, fix){
 var row = $("<tr></tr>").attr("scope", "row");
 row.append($("<td></td>").text(jugador.dorsal));
 row.append($("<td></td>").text(jugador.nombre_jugador));
 row.append($("<td></td>").text(jugador.nacionalidad));
 row.append($("<td></td>").text(jugador.edad));
 row.append($("<td></td>").text(jugador.posicion));
 if (!fix)
    row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-x").attr("id", "eliminar_jugador").attr("onclick", "eliminarJugador("+jugador.dorsal+",\""+jugador.nombre_jugador+"\")")));
 $("#lista_jugadores").append(row);
}

//Hace el request para eliminar un jugador de la BD
function eliminarJugador(camiseta, nombre){  

  $.confirm({
    animation: 'zoom',
    closeAnimation: 'scale',
    title: 'Eliminar '+nombre,
    content: '¿Está seguro que desea eliminarlo?',
    buttons: {
        cancelar:{ 
          btnClass: 'btn-danger',
          action: function () {}
        },
         Aceptar: {
            btnClass: 'btn-success',
            action:  function () {                          
                         var equipo = $("#modal_equipo_jugador").val();
                         $.post('/eliminarJugador', {
                             _token: $('meta[name=csrf-token]').attr('content'),
                             nombre_equipo: equipo,
                             dorsal: camiseta
                             }
                            )
                           .done(function(datos) {
                              eliminarJugadorLista(camiseta);
                              ejecutarToast(nombre+" eliminado");
                            })
            }
        }
    }
  }); 
}

//Elimina un jugador de la lista
function eliminarJugadorLista(dorsal){

  $('#tabla_jugadores > tbody  > tr' ).each(function() {
    var d = ($(this).children('td:first').html());
    if (parseInt(d) === dorsal){
      $(this).remove();
    }
  });

  var s = $("#tabla_jugadores tr").length;
  if ($("#tabla_jugadores tr").length === 2){
    var row = $("<tr></tr>").attr("scope", "row").append($("<td></td>").text("No hay jugadores para mostrar.").attr("colspan", "6"));
    $("#lista_jugadores").find("tr:last").before(row);
  }
}

//Calcula la edad de un jugador en base a la fecha de nacimiento
function calcularEdad(fecha){
  var cumpleaños = +new Date(fecha);
  var edad = ~~((Date.now() - cumpleaños) / (31557600000));
  return edad;
}

//Chequea si se llego al maximo de equipos de un torneo
function chequearEquipos(){

  var cant, total;
  $.get("/api/equipos", function(datas, status) {
    cant = datas.length;    
    var rowfinal;

     $.get("/api/configuracion", function(config, status){ 
        if(cant < config[0].equipos){
          rowfinal = $("<a></a>").text("+").attr("class", "list-group-item list-group-item-action bg-danger text-light").attr("id", "btnAgregarEquipo").attr("data-toggle", "modal").attr("data-target", "#modalEquipo");
          $("#guardarEquipo").prop('disabled', false);
          $('#lista-equipos').append(rowfinal);
        }
        else{
          $.get("/api/fechas", function(data, status){
            if(jQuery.isEmptyObject(data)){             
                rowfinal = $("<a></a>").text("Generar Fixture").attr("class", "list-group-item list-group-item-action bg-danger text-light").attr("onclick", "genfix();").attr("id", "btnGenerarFixture");
                $("#guardarEquipo").prop('disabled', true);
                $('#lista-equipos').append(rowfinal);
            }
          });
        }
     });
  });
}

function ejecutarToast(mensaje){
  toastr.success(mensaje);
}

function cantidad_equipos(){
   $.get("/api/configuracion", function(data, status){
        total = data.equipos;
    });
}


