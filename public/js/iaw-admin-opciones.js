  //Código para validar campos al modificar las opciones del torneo
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      var forms = document.getElementsByClassName('form-opciones');
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          else{
            submitOpciones();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();


 //Carga las opciones que se tenían en ese momento y los agrega
 //como texto en su respectivo input
 function cargarOpciones(){
     //Carga los usuarios en la tabla
     $.get("/api/users", function(data, status) {
      mostrarUsuarios(data);
    });

     $.get("/api/fechas", function(data, status) {
        if(!jQuery.isEmptyObject(data)){
         $("#cant_equipos").prop('disabled', true);
         $("#cant_jugadores").prop('disabled', true);
         $("#fecha_inicio").prop('disabled', true);
       }
     });

     //Carga las valores de los inputs
     $.get("/api/configuracion", function(objeto, status) {

      $("#cant_equipos").val(objeto[0].equipos);
      $("#cant_jugadores").val(objeto[0].cant_jugadores);
      $("#fecha_inicio").val(objeto[0].fecha);

    });

   }


  //Carga los usuarios registrados en una tabla que permite seleccionarlos como editores
  function mostrarUsuarios(users){
     $.each(users, function (i, user) {
       var row = $("<tr></tr>").attr("scope", "row");
       row.append($("<td></td>").text(user.google.name));
       row.append($("<td></td>").text(user.google.email));
       if (user.editor === true)
         row.append($("<td></td>").append($('<input checked></input>').attr("type", "checkbox").attr("id", "check_usuario"+i)));
       else
         row.append($("<td></td>").append($('<input></input>').attr("type", "checkbox").attr("id", "check_usuario"+i)));
       $('#lista_usuarios').append(row);
    });

 }


//POST para agregar las nuevas opciones del torneo
function submitOpciones(){
   var cant_equipos = $("#cant_equipos").val();
   var cant_jugadores = $("#cant_jugadores").val();
   var fecha_inicio = $("#fecha_inicio").val();


   if (fecha_inicio.indexOf('-') !== -1) {
     const year = fecha_inicio.substring(0,4);
     let mes = fecha_inicio.substring(5,7);
     let dia = fecha_inicio.substring(8,10);

     if (mes.length < 2) 
      month = '0' + month;
     if (dia.length < 2) 
      day = '0' + day;

     var f = dia + "/" + mes + "/" + year;
   }

   else{
    var f = fecha_inicio;
   }

   var seleccionados = new Array();
   var noSeleccionados = new Array();
   var i = 0;
   $('#tabla_usuarios > tbody  > tr' ).each(function() {
     var check = $("#check_usuario"+i).is(":checked");
     if (check)
        seleccionados.push($(this).children('td:nth-child(2)').text());
     else
        noSeleccionados.push($(this).children('td:nth-child(2)').text());
     i++;
   });

   event.preventDefault();

   if (checkDate()){      
      $.post('/guardarOpciones', {
         _token: $('meta[name=csrf-token]').attr('content'),
         equipos: cant_equipos,
         jugadores: cant_jugadores,
         fecha: f,
         usuariosS: seleccionados,
         usuariosNS: noSeleccionados
       }
       )
       .done(function(data) {
          toastr.success("Opciones guardadas");
          $("#fecha_inicio").val(f);
          })
       .fail(function() {
          alert( "error" );
      });
    }
    else{
       toastr.error("Ingrese una fecha correcta");
    }
}

 //Chequea que una fecha sea correcta
 function checkDate() {
   var selectedText = $('#fecha_inicio').val();
   var selectedDate = new Date(selectedText);
   var now = new Date();
   if (selectedDate < now) {
    $('#fecha_inicio').css("border-color", "#dc3545");
    return false;
   }
   $('#fecha_inicio').css("border-color", "#28a745");
   return true;
 }
