

$( document ).ready(function(){

    const user = JSON.parse(localStorage.getItem('user'));
    const url = localStorage.getItem('url');
    
    
    $('#N_usuario').append(user.primer_nombre +" "+ user.apellido_paterno) ;
    $('#nombre').append(user.primer_nombre);
    $('#apellido').append(user.apellido_paterno); 
    $('#rut').append(user.rut);
    $('#direccion').append(user.direccion);
    $('#correo').append(user.correo);
    $('#fono').append(user.fono);
    
    if(user.tipo == 'user'){
        $('#cargo').append('Usuario');
    }
    console.log(user);
    
});