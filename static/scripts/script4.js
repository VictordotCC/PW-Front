console.log("hola");

$( document ).ready(function(){

    const user = JSON.parse(localStorage.getItem('user'));
    const url = localStorage.getItem('url');
    
    
    
    $('#nombre').append(user.primer_nombre);
    $('#apellido').append(user.apellido_paterno); 
    $('#rut').append(user.rut);
    $('#direccion').append(user.direccion);
    $('#correo').append(user.correo);
    $('#fono').append(user.fono);

    
});
 
