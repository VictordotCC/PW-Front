cargarProductos();

$(document).ready(function() {
    cargarRegiones();
    $('.nav-link').click(function(event){
            $('.nav-link').removeClass('activo');
            $(this).addClass('activo');   
    });
    $('.navbar-brand').click(function(event){
            $('.nav-link').removeClass('activo');
    });
    $('#filtros').click(function(event){
        $('#menuFiltros').children().each(function(index, el) {
            if ($(el).hasClass('checkbox')) {
                var isChecked= $(el).children().children().is(':checked');
                if (!isChecked) {
                    $('.'+$(el).text()).addClass('d-none');
                } else {
                    $('.'+$(el).text()).removeClass('d-none');
                }
            };
        });
        
    });

    function cargarRegiones(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "static/scripts/regiones", true);
        xmlhttp.send();
        xmlhttp.onloadend = function(){
            var listado = xmlhttp.responseText;
            listado = listado.split('\n');
            listado.slice(1).forEach(function(region){
                var lista_regiones = region.split('|');
                $('#InputRegion').append('<option value="'+lista_regiones[0]+'">'+lista_regiones[1]+'</option>');
            });
        };
    }

    $('#InputRegion').change(function(event){
        var comuna = $(this).val();
        cargarComunas(comuna);
    });

    function cargarComunas(region_value) {
        $('#InputComuna').empty();
        if (region_value == '') {
            $('#InputComuna').append('<option value="">Seleccione una comuna</option>');
        };
        region_value = region_value;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "static/scripts/comunas", true);
        xmlhttp.send();
        xmlhttp.onloadend = function() {
            var listado = xmlhttp.responseText;
            listado = listado.split('\n');
            listado.forEach(function(comuna) {
                var lista_comunas = comuna.split('|');
                if (parseInt(lista_comunas[2]) == region_value) {
                    $('#InputComuna').append('<option value="'+lista_comunas[0]+'" name="'+lista_comunas[1]+'">'+lista_comunas[1]+'</option>');
                };
            });
        };
    };

    $('#InputNewPassword2').focusout(function(event){
        var pass = $('#InputNewPassword');
        var pass2 = $('#InputNewPassword2');
        if (pass.val() == pass2.val()) {
            $('#InputNewPassword2').removeClass('is-invalid');
        } else {
            $('#InputNewPassword2').addClass('is-invalid');
            pass2[0].setCustomValidity('Las contraseñas no coinciden');
            pass2[0].reportValidity();
        }
    });
    
    $('#InputNewPassword').focusout(function(event){
        var pass = $('#InputNewPassword').val();
        var pass2 = $('#InputNewPassword2').val();
        if (pass != pass2) {
            $('#InputNewPassword2').addClass('is-invalid');
        } else {
            $('#InputNewPassword2').removeClass('is-invalid');
        }
    });

    $('#loguear').click(function(event){
        var email = $('#InputEmail').val();
        var pass = $('#InputPassword').val();
        $.ajax({
            url: '/login',
            type: 'POST',
            method: 'POST',
            data: {
                email: email,
                pass: pass
                },
            success: function(obj, status){
                $('#inicio-sesion').children().remove();
                $('#inicio-sesion').append('<div class="d-flex text-center align-items-center pe-3"><h6 style="color: white">Bienvenido, '+obj.primer_nombre+'</h3></div>');
                $('#inicio-sesion').append('<div class="d-flex d-none d-lg-block"><a class="btn btn-success" aria-current="false" href="perfil/'+obj.id_usuario+'"><i class="fas fa-user-circle"></i></a></div>');
                $('#inicio-sesion').append('<div class="d-flex d-none d-lg-block"><a class="btn btn-success" aria-current="false" href="/logout" ><i class="fas fa-sign-out-alt"></i></a></div>');
                $('#modalLogin').modal('toggle');
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
            url: '/registrar',
            type: 'POST',
            method: 'POST',
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
});

function cargarProductos(){
    $.ajax({
        url: '/productos',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var productos = data;
            console.log(typeof(productos));
            productos.forEach(function(producto){
                var producto_html = 
                                    `<div class="col ${producto.categoria}">
                                        <div class="card shadow-sm bg-success ">
                                            <img src="static/img/${producto.imagen}" height="225">
                                    
                                            <div class="card-body">
                                                <p class="card-text text-white" font-color="#ccc">${producto.nombre}</p>
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <div class="btn-group">
                                                        <button type="button" class="btn btn-sm btn-outline-secondary btn-close-white"  data-bs-toggle="modal" data-bs-target="#modalDetalles${producto.id_producto}">Detalles</button>
                                                        <button type="button" class="btn btn-sm btn-outline-secondary btn-close-white agregar ${producto.categoria} ${producto.codigo}">Agregar</button>
                                                    </div>
                                                    <span class="text-muted align-bottom">$${producto.valor_venta.toLocaleString('es-CL')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                var modal_html =
                            `<div class="modal fade modal-fullscreen-sm-down " id="modalDetalles${producto.id_producto}" tabindex="-1" role="dialog" aria-labelledby="modalDetallesLabel" aria-hidden="true">
                                <div class="modal-dialog " role="img">
                                    <div class="modal-content">
                                        <div class="modal-header bg-jardin">
                                            <h5 class="modal-title" id="modalDetalles" style="color: #ffffff;">Detalles</h5>
                                        </div>
                                        <div class="row text-center">
                                            <p style="color: #95939d">${producto.nombre}</p>
                                            <div class="modal-body">
                                                <div class="lista" >
                                                    <img src="static/img/${producto.imagen}"  class="rounded-3" alt="${producto.nombre}" width="300px">
                                                    <ul class="list-group list-group-flush col-12">
                                                        <li class="list-group-item" style="color: #95939d">Más Información</li>
                                                        <li class="list-group-item">${producto.descripcion}</li>
                                                        <li class="list-group-item">$${producto.valor_venta.toLocaleString('es-CL')}</li>
                                                    </ul>
                                                    <div class = "d-flex justify-content-between p-2">
                                                        <p class="list-group-item" style="color: #95939d">Categoría: ${producto.categoria}</p>
                                                        <p class="list-group-item" style="color: #95939d">Codigo: ${producto.codigo}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                $('#contenedor-productos').append(producto_html);
                $('body').append(modal_html);
                
            });
        }
    });
};

