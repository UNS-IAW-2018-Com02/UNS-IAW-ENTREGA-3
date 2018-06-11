 //Carga las noticias y las muestra en la tabla    
  function cargarNoticias(){

   $.get("/api/noticias", function(data, status) {
    if(data.length === 0){
      var row = $("<tr></tr>").attr("scope", "row");
      row.append($("<td></td>").text("No hay noticias para mostrar").attr("colspan", "7"));
      $("#lista_noticias").append(row);
    }
    else{
      $.each(data, function (i, noticia) {

        var estado, subida, bajada;
        if(noticia.seleccionada === 'true'){ 
          estado = "Publicada";
          subida = false;
          bajada = true;
        }
        else{
          estado = "No Publicada";
          subida = true;
          bajada = false;
        }

        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text(noticia.titulo));
        row.append($("<td></td>").text(noticia.fecha));
        row.append($("<td></td>").text(estado));  
        row.append($("<td></td>").text(noticia.categoria.charAt(0).toUpperCase() + noticia.categoria.slice(1)));  

        row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-plus").attr("id", "publicar_noticia").attr("onclick", "publicar_noticia('"+ noticia.titulo +"', true);")));
        row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-minus").attr("id", "bajar_noticia").attr("onclick", "publicar_noticia('"+ noticia.titulo +"', false);")));
        row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-x").attr("id", "eliminar_noticia").attr("onclick", "eliminarNoticia('"+ noticia.titulo +"');")));

        $("#lista_noticias").append(row);
      }); 

    }
    $("#tabla_noticias").show();

  });   

 }

 //Modifica el estado de la noticia segun corresponda
 function publicar_noticia(t, estado){

    $.post('/alta_baja_noticia', {
       _token: $('meta[name=csrf-token]').attr('content'),
       titulo: t,
       estado: estado
      }
     )
      .done(function(datos) {
        if (estado === true)
          toastr.success("Noticia Publicada");
        else
          toastr.success("Noticia Despublicada");
        actualizarNoticias(t, estado);
      })
}

//Elimina la noticia seleccionada
function eliminarNoticia(t){

 $.confirm({
  animation: 'zoom',
  closeAnimation: 'scale',
  title: 'Eliminar noticia',
  content: '¿Está seguro que desea eliminarla?',
  buttons: {
    cancelar:{ 
      btnClass: 'btn-danger',
      action: function () {}
    },
    Aceptar: {
      btnClass: 'btn-success',
      action:  function () {              
        $.post('/eliminarNoticia', {
         _token: $('meta[name=csrf-token]').attr('content'),
         titulo: t,
       }
       )
        .done(function(datos) {
          toastr.success("Noticia Eliminada");
          eliminarNoticiaLista(t);
        })
      }
    }
  }
});  


}

//Borra de la lista la noticia eliminada
function eliminarNoticiaLista(t){

  $('#tabla_noticias > tbody  > tr' ).each(function() {
    var d = ($(this).children('td:first').html());
    if (d === t){
      $(this).remove();
    }
  });
  

  if ($("#tabla_noticias tr").length === 1){
    var row = $("<tr></tr>").attr("scope", "row").append($("<td></td>").text("No hay noticias para mostrar.").attr("colspan", "7"));
    $("#tabla_noticias > tbody").append(row);
  }
}

//Actualiza el estado de una noticia modificada
function actualizarNoticias(t, estado){

 $('#tabla_noticias > tbody  > tr' ).each(function() {

  var d = ($(this).children('td:first').html());
  var celda = $(this).children('td:nth-child(3)');

  var est;
  if(estado)
    est = "Publicada";
  else
    est = "No Publicada";

  if (d === t)
   $(celda).html(est);

});

}

