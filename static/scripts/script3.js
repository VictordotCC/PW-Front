//AÑADE A TODOS LOS BOTONES CON EL NAME count_click QUE AL SER PULSADOS EJECUTEN EL CONTADOR
$( document ).ready(function(){

  const user = JSON.parse(localStorage.getItem('user'));
  const url = localStorage.getItem('url');
  
  //carga info del usuario
  $('#nombre-usuario').append(user.primer_nombre + ' ' + user.apellido_paterno);
  $('#direccion').append(user.direccion);
  $('#fono').append(user.fono);
  $('#correo').append(user.correo);
  if (user.tipo == 'Admin') {
    $('#cargo').append('Administrador');
  }



  var sumar;
  //AÑADE UN CLICK AL EJECUTAR LA FUNCIÓN
  function agregarCounter() {
    sumar += 1;
  }
  function restarCounter() {
    if (sumar > 0) {
      sumar -= 1;
    }
  }
  $("#sumar").click(function(){
    sumar = parseInt($("#counter-label").val());
    agregarCounter();
    $("#counter-label").val(sumar);
  });
  
  $("#restar").click(function(){
    sumar = parseInt($("#counter-label").val());
    restarCounter();
    $("#counter-label").val(sumar);
  });

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
        cache: false,
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