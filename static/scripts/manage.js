$(document).ready(function() {
    user = localStorage.getItem('user');
    if (user != 'null') {
        user = JSON.parse(user);
        $('#inicio-sesion').children().remove();
        $('#inicio-sesion').append('<div class="d-flex text-center align-items-center pe-3"><h6 style="color: white">Bienvenido, '+user.primer_nombre+'</h3></div>');
        $('#inicio-sesion').append('<div class="d-flex d-none d-lg-block"><button id="perfil" type="button" class="btn btn-success" aria-current="false"><i class="fas fa-user-circle"></i></button></div>');
        $('#inicio-sesion').append('<div class="d-flex d-none d-lg-block"><button id="cerrar-sesion" type="button" class="btn btn-success" aria-current="false"><i class="fas fa-sign-out-alt"></i></button></div>');

        $('#perfil').click(function(event){
            if (user.tipo == 'Admin') {
                window.location.href = 'administrador.html';
            }
            else if (user.tipo == 'Cliente') {
                window.location.href = 'usuario.html';
            }
        });

        $('#cerrar-sesion').click(function(event){
            localStorage.setItem('user', null);
            $('#inicio-sesion').children().each(function(index){
                $(this).remove();
            });
            login_original = `<div class="d-flex">
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalLogin">Iniciar Sesi&oacute;n</button>
                            </div>
                            <div class="d-flex">
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalRegistro">Registrarse</button>
                            </div>`;
            $('#inicio-sesion').append(login_original);
            console.log(window.location.href);
            if (window.location.href.includes('administrador.html') || window.location.href.includes('usuario.html')) {
                
                window.location.replace('index.html');                
            }
        });
    }
});



$('#loguear').click(function(event){
    var email = $('#InputEmail').val();
    var pass = $('#InputPassword').val();
    $.ajax({
        url: `${url}/login`,
        type: 'POST',
        method: 'POST',
        data: {
            email: email,
            pass: pass
            },
        success: function(obj, status){
            localStorage.setItem('user', JSON.stringify(obj));
            $('#inicio-sesion').children().remove();
            $('#inicio-sesion').append('<div class="d-flex text-center align-items-center pe-3"><h6 style="color: white">Bienvenido, '+obj.primer_nombre+'</h3></div>');
            $('#inicio-sesion').append('<div class="d-flex d-none d-lg-block"><button id="perfil" type="button" class="btn btn-success" aria-current="false"><i class="fas fa-user-circle"></i></button></div>');
            $('#inicio-sesion').append('<div class="d-flex d-none d-lg-block"><button id="cerrar-sesion" type="button" class="btn btn-success" aria-current="false"><i class="fas fa-sign-out-alt"></i></button></div>');
            $('#modalLogin').modal('toggle');

            $('#perfil').click(function(event){
                if (obj.tipo == 'Admin') {
                    window.location.href = 'administrador.html';
                }
                else if (obj.tipo == 'Cliente') {
                    window.location.href = 'usuario.html';
                }
            });

            $('#cerrar-sesion').click(function(event){
                localStorage.setItem('user', null);
                $('#inicio-sesion').children().each(function(index){
                    $(this).remove();
                });
                login_original = `<div class="d-flex">
                                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalLogin">Iniciar Sesi&oacute;n</button>
                                </div>
                                <div class="d-flex">
                                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalRegistro">Registrarse</button>
                                </div>`;
                $('#inicio-sesion').append(login_original);          
            });
        },
        error: function(obj, status){
            alert('Usuario o contraseña incorrectos');
        }            
    });
});

$('#registrar').click(function(event){
    var nombre = $('#inputNombre').val();
    if (nombre == '') {
        $('#inputNombre').addClass('is-invalid');
        $('#inputNombre')[0].setCustomValidity('El nombre es obligatorio');
        $('#inputNombre')[0].reportValidity();
    } else {
        $('#inputNombre').removeClass('is-invalid');
    }
    var apellido = $('#inputApellido').val();
    if (apellido == '') {
        $('#inputApellido').addClass('is-invalid');
        $('#inputApellido')[0].setCustomValidity('El apellido es obligatorio');
        $('#inputApellido')[0].reportValidity();
    } else {
        $('#inputApellido').removeClass('is-invalid');
    }
    var rut = $('#inputRun').val();
    if (rut == '' || rut.split('-').length != 2 || !rut.includes('-')) {
        $('#inputRun').addClass('is-invalid');
        $('#inputRun')[0].setCustomValidity('Debe ingresar un rut válido con guión');
        $('#inputRun')[0].reportValidity();
    } else {
        $('#inputRun').removeClass('is-invalid');
    }
    var email = $('#InputNewEmail').val();
    if (email == '' || !email.includes('@') || !email.includes('.') || email.split('@').length != 2) {
        $('#InputNewEmail').addClass('is-invalid');
        $('#InputNewEmail')[0].setCustomValidity('El email no es válido');
        $('#InputNewEmail')[0].reportValidity();
    } else {
        $('#InputNewEmail').removeClass('is-invalid');
    }
    var direccion = $('#InputDireccion').val();
    if (direccion == '') {
        $('#InputDireccion').addClass('is-invalid');
        $('#InputDireccion')[0].setCustomValidity('La dirección es obligatoria');
        $('#InputDireccion')[0].reportValidity();
    } else {
        $('#InputDireccion').removeClass('is-invalid');
    }
    var Nombre_region = ($('#InputRegion option:selected').text().slice(0, -1))
    var Nombre_comuna = $('#InputComuna option:selected').text();
    var fono = $('#InputFono').val();
    if (fono == '') {
        $('#InputFono').addClass('is-invalid');
        $('#InputFono')[0].setCustomValidity('El teléfono es obligatorio');
        $('#InputFono')[0].reportValidity();
    } else {
        $('#InputFono').removeClass('is-invalid');
    }
    var password = $('#InputNewPassword').val();
    if (password == '') {
        $('#InputNewPassword').addClass('is-invalid');
        $('#InputNewPassword')[0].setCustomValidity('La contraseña es obligatoria');
        $('#InputNewPassword')[0].reportValidity();
    } else {
        $('#InputNewPassword').removeClass('is-invalid');
    }
    var password2 = $('#InputNewPassword2').val();
    if (password2 == '') {
        $('#InputNewPassword2')[0].setCustomValidity('Las contraseñas no coinciden');
        $('#InputNewPassword2')[0].reportValidity();
    }
    var suscripcion = $('#Suscripcion').is(':checked');
    var inputs = $('#form-registro').find('.is-invalid');
    if (inputs.length > 0) {
        return false;
    };
    $.ajax({
        url: `${url}/registrar`,
        type: 'POST',
        data: {
            nombre: nombre,
            apellido: apellido,
            rut: rut,
            email: email,
            direccion: direccion,
            Nombre_region: Nombre_region,
            Nombre_comuna: Nombre_comuna,
            fono: fono,
            password: password,
            suscripcion: suscripcion
            },
        success: function(status){
            $('#modalRegistro').modal('toggle');
            alert('Usuario registrado correctamente\nInicie sesión para continuar');
        },
        error: function(status){
            alert('Error al registrar usuario');
        }
    });
});