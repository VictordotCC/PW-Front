//AÑADE A TODOS LOS BOTONES CON EL NAME count_click QUE AL SER PULSADOS EJECUTEN EL CONTADOR
$( document ).ready(function(){

  const user = JSON.parse(localStorage.getItem('user'));
  const url = localStorage.getItem('url');
  localStorage.setItem('url', url);
  
  //carga info del usuario
  $('#nombre-usuario').append(user.primer_nombre + ' ' + user.apellido_paterno);
  $('#direccion').append(user.direccion);
  $('#fono').append(user.fono);
  $('#correo').append(user.correo);
  if (user.tipo == 'Admin') {
    $('#cargo').append('Administrador');
  }

  //cargar productos
  tabla_producto();
    
  
  function tabla_producto(){
    $('#productos').empty();
    $.ajax({
      url: `${url}/productos`,
      type: 'GET',
      dataType: 'json',
      success: function(data){
        data.forEach (function(producto){
          var product_html;
          product_html = 
                `<tr>
                <input id="idProducto" type="hidden" value="${producto.id_producto}">
                <td scope="col">${producto.nombre}</td>
                <td scope="col">${producto.categoria}</td>
                <td scope="col">$${producto.valor_venta.toLocaleString('es-CL')}</td>
                <td scope="col">${producto.stock}</td>
                <td scope="col" style="color:rgb(12, 97, 36)"><i class="fa-solid fa-edit clickable pe-2 editar"></i>
                <span scope="col" style="color: rgb(250, 1, 1)"><i class="fa-solid fa-delete-left ps-2 clickable eliminar"></i></span></td>
                </tr>`;
                $('#productos').append(product_html);
                });

                //editar producto
                $('.editar').click(function(){
                  var id_producto = $(this).closest('tr').find('#idProducto').val();
                  $.ajax({
                    url: `${url}/producto/${id_producto}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){
                      $('#modalEdicionProducto').modal('show');
                      $('#id_editproducto').val(id_producto);
                      $('#edit_producto').val(data.nombre);
                      $('#editDescripcion').val(data.descripcion);
                      $('#editCategoria').val(data.categoria);
                      $('#editPrecio').val(data.valor_venta);
                      $('#editStock').val(data.stock);
                      $('#imagenActual').attr('src', `${url}/static/img/${data.imagen}`);
                    }         
                  });                  
                });

                //eliminar producto
                $('.eliminar').click(function(){
                  var id_producto = $(this).closest('tr').find('#idProducto').val();
                  $.ajax({
                    url: `${url}/producto/${id_producto}`,
                    type: 'DELETE',
                    success: function(data){
                      tabla_producto();
                    }
                  });
                });

                //editar producto
                $('#editarProducto').click(function(){
                  var id_producto = $("#id_editproducto").val();
                  var nombre = $("#edit_producto").val();
                  var descripcion = $("#editDescripcion").val();
                  var categoria = $("#editCategoria").val();
                  var precio = $("#editPrecio").val();
                  var stock = $("#editStock").val();
                  //TODO: que hacer con imagen
                  //var imagen = $("#formEditFile").get(0).files.length;
                  var formdata = new FormData($("#formularioEdit")[0]);
                  if (nombre == "" || descripcion == "" || categoria == "" || precio == "" || stock == "") {
                    alert("Todos los campos son obligatorios");
                  }
                  else {
                    $.ajax({
                      url: `${url}/producto/${id_producto}`,
                      type: 'PUT',
                      data: formdata,
                      contentType: false,
                      processData: false,
                      success: function(data){
                        $('#modalEdicionProducto').modal('hide');
                        tabla_producto();
                      }
                    });
                  }
                });
        }
       
      }
    )};

    $("#Registrar_Producto").click(function(){
    var nombre = $("#n_producto").val();
    var descripcion = $("#inputDescripcion").val();
    var categoria = $("#inputCategoria").val();
    var precio = $("#inputPrecio").val();
    var stock = $("#inputStock").val();
    var imagen = $("#formFile").get(0).files.length;
    var formdata = new FormData($("#formulario")[0]);

    if (nombre == "" || descripcion == "" || categoria == "" || precio == "" || stock == "" || imagen == 0) {
      alert("Todos los campos son obligatorios");
    }
    else {
      $.ajax({
        url: `${url}/registrar-producto`,
        type: "POST",
        data: formdata,
        contentType: false,
        processData: false,
        success: function(data) {
          $("#formulario").trigger("reset");
          alert("Producto registrado");
        }
      });
    } 
  });

  $("#formFile").change(function(){
    if  ($("#formFile").get(0).files.length > 0) {
      var file = this.files[0];
      var fileType = file["type"];
      if (!fileType.includes("image")) {
        alert("El archivo debe ser una imagen");
        $("#formFile").val(null)
      }
    }
  });



  
  

  //Actualizar Stock
});