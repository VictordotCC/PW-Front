const url = localStorage.getItem('url');
$(document).ready(function() {
    var carrito = JSON.parse(localStorage.getItem('carrito'));
    var user;
    cargarRegiones();
    
    $.ajax({
        url: `${url}/carrito`,
        type: 'POST',
        data: {
            carrito: carrito
        },
        success: function(data) {
            var subtotal = 0;
            var iva;
            var total;
            
            data.forEach(function(producto) {
                product_html = 
                `   <tr><td scope="col">${producto.nombre}</td>
                    <td scope="col">$${producto.valor_venta.toLocaleString('es-CL')}</td>
                    <td scope="col">${producto.cantidad}</td>
                    <td scope="col">$${(producto.valor_venta * producto.cantidad).toLocaleString('es-CL')}</td>
                    <td scope="col" style="color: rgb(250, 1, 1)"><i class="fa-solid fa-delete-left ps-4 clickable eliminar"></i></td>
                    <td><input type="hidden" name="codigo" value="${producto.codigo}"></td>
                    </tr>`;
                $('#productos').append(product_html);
                subtotal += producto.valor_venta * producto.cantidad;
                });

            $('#subtotal').text("$"+ subtotal.toLocaleString('es-CL'));
            $('#iva').text("$"+ (Math.round(subtotal * 0.19)).toLocaleString('es-CL'));
            total = subtotal + (Math.round(subtotal * 0.19));
            $('#total').text("$"+ total.toLocaleString('es-CL'));

            $('.eliminar').click(function() {
                $(this).parent().parent().remove();
                subtotal -= $(this).parent().parent().children().eq(3).text().replace(/[^0-9]/g, '');
                $('#subtotal').text("$"+ subtotal.toLocaleString('es-CL'));
                iva = Math.round(subtotal * 0.19);
                $('#iva').text("$"+ iva.toLocaleString('es-CL'));
                total = subtotal + iva;
                $('#total').text("$"+ total.toLocaleString('es-CL'));
                item = $(this).parent().parent().children().eq(5).children().val();
                // remove all ocurrences of the item from the cart
                carrito = carrito.filter(function(element) {
                    return element!= item;
                    });
                localStorage.setItem('carrito', JSON.stringify(carrito));
                $('#total_modal').text(total.toLocaleString('es-CL'));
                    
                if ($('#productos').children().length == 0) {
                    $('#productos').append('<tr><td colspan="7" style="text-align: center;">No hay productos en el carrito</td></tr>');
                    $('#btn-pagar').attr('disabled', true);
                }
            });
            $('#btn-pagar').click(function() {
                user = JSON.parse(localStorage.getItem('user'));
                if (user == null) {
                    inputhtml = `<form>
                                <div class="form-group">
                                    <label for="nombre">Nombre</label>
                                    <input type="text" class="form-control" id="nombre" placeholder="Nombre">
                                    <label for="apellido">Apellido</label>
                                    <input type="text" class="form-control" id="apellido" placeholder="Apellido">
                                    <label for="rut">Rut</label>
                                    <input type="text" class="form-control" id="rut" placeholder="Rut">
                                    <label for="email">Email</label>
                                    <input type="text" class="form-control" id="email" placeholder="Email">
                                    <label for="Direccion">Direccion</label>
                                    <input type="text" class="form-control" id="Direccion" placeholder="Direccion">
                                    <label for="Region">Regi&oacute;n</label>
                                    <select class="form-select" id="Region" required>
                                        <option value="">Seleccione una Regi&oacute;n</option>
                                    </select><br>
                                    <label for="Comuna">Comuna</label>
                                    <select class="form-select" id="Comuna" required>
                                        <option value="">Seleccione una Comuna</option>
                                    </select>
                                    <label for="Telefono">Telefono</label>
                                    <input type="text" class="form-control" id="Telefono" placeholder="Telefono">
                                </div>`;
                    $('#info').html(inputhtml);
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET", `${url}/static/assets/regiones`, true);
                    xmlhttp.send();
                    xmlhttp.onloadend = function(){
                        var listado = xmlhttp.responseText;
                        listado = listado.split('\n');
                        listado.slice(1).forEach(function(region){
                            var lista_regiones = region.split('|');
                            $('#Region').append('<option value="'+lista_regiones[0]+'">'+lista_regiones[1]+'</option>');
                        });
                    };
                    
                    $('#Region').change(function(event){
                        var region = $(this).val();
                        $('#InputComuna').empty();
                        if (region == '') {
                            $('#Comuna').append('<option value="">Seleccione una Comuna</option>');
                        }
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.open("GET", `${url}/static/assets/comunas`, true);
                        xmlhttp.send();
                        xmlhttp.onloadend = function() {
                            var listado = xmlhttp.responseText;
                            listado = listado.split('\n');
                            listado.forEach(function(comuna) {
                                var lista_comunas = comuna.split('|');
                                if (parseInt(lista_comunas[2]) == region) {
                                    $('#Comuna').append('<option value="'+lista_comunas[0]+'">'+lista_comunas[1]+'</option>');
                                }
                            });
                        }                                        
                    });                
                }
                else {
                    $('#info').html(`<p>Estimado, ${user.primer_nombre} ${user.apellido_paterno}</p>Direccion: ${user.direccion}`);
                }
                $('#info').append(`<br>El total de la compra es: $<span id="total_modal">${total.toLocaleString('es-CL')}</span> y se enviara a la dirección indicada.`);
            });
            $('#confirmar').click(function() {
                if (user == null) {
                    var nombre = $('#nombre').val();
                    if (nombre == '') {
                        $('#nombre').addClass('is-invalid');
                        $('#nombre')[0].setCustomValidity('El nombre es obligatorio');
                        $('#nombre')[0].reportValidity();
                    } else {
                        $('#nombre').removeClass('is-invalid');
                    }
                    var apellido = $('#apellido').val();
                    if (apellido == '') {
                        $('#apellido').addClass('is-invalid');
                        $('#apellido')[0].setCustomValidity('El apellido es obligatorio');
                        $('#apellido')[0].reportValidity();
                    } else {
                        $('#apellido').removeClass('is-invalid');
                    }
                    var rut = $('#rut').val();
                    if (rut == '' || rut.split('-').length != 2 || !rut.includes('-')) {
                        $('#rut').addClass('is-invalid');
                        $('#rut')[0].setCustomValidity('Debe ingresar un rut válido con guión');
                        $('#rut')[0].reportValidity();
                    } else {
                        $('#rut').removeClass('is-invalid');
                    }
                    var email = $('#email').val();
                    if (email == '' || !email.includes('@') || !email.includes('.') || email.split('@').length != 2) {
                        $('#email').addClass('is-invalid');
                        $('#email')[0].setCustomValidity('El email no es válido');
                        $('#email')[0].reportValidity();
                    } else {
                        $('#email').removeClass('is-invalid');
                    }
                    var direccion = $('#Direccion').val();
                    if (direccion == '') {
                        $('#Direccion').addClass('is-invalid');
                        $('#Direccion')[0].setCustomValidity('La dirección es obligatoria');
                        $('#Direccion')[0].reportValidity();
                    } else {
                        $('#Direccion').removeClass('is-invalid');
                    }
                    var Nombre_region = ($('#Region option:selected').text().slice(0, -1))
                    var Nombre_comuna = $('#Region option:selected').text();
                    var fono = $('#Telefono').val();
                    if (fono == '') {
                        $('#Telefono').addClass('is-invalid');
                        $('#Telefono')[0].setCustomValidity('El teléfono es obligatorio');
                        $('#Telefono')[0].reportValidity();
                    } else {
                        $('#Telefono').removeClass('is-invalid');
                    }
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
                            password: '',
                            suscripcion: 'false'
                            },
                        success: function(data) {
                            console.log(data);
                            //user = JSON.stringify(data);
                            $.ajax({
                                url: `${url}/comprar`,
                                type: 'POST',
                                data: {
                                    user_id: data.id_usuario,
                                    direccion: data.direccion,
                                    comuna: data.comuna_id,
                                    user_nombre: `${data.primer_nombre} ${data.apellido_paterno}`,
                                    user_rut: data.rut,
                                    carrito: carrito
                                },
                                success: function(data) {
                                    alert('Compra realizada con éxito');
                                    $('.modal').modal('hide');
                                    localStorage.setItem('carrito', JSON.stringify([]));     
                                    $('#productos').children().remove();
                                    $('#eliminar').remove();
                                    $('.title').text('Detalle Boleta');
                                    data.forEach(function(item) {
                                        if (item.nombre == 'undefined' || item.nombre == null) {
                                            $('#subtotal').text("$"+ item.subtotal.toLocaleString('es-CL'));
                                            $('#iva').text("$"+ item.iva.toLocaleString('es-CL'));
                                            $('#total').text("$"+ item.total.toLocaleString('es-CL'));
                                            voucher_html = `<th>Número de Voucher</th>
                                                            <td>${item.voucher}</td>`;
                                            $('#voucher').append(voucher_html);
                                            seguimiento_html = `<th>Número de Seguimiento</th>
                                                            <td>${item.id_despacho}</td>`;
                                            $('#seguimiento').append(seguimiento_html);
                                            $('#btn-pagar').remove();
                                        } else {
                                            product_html = 
                                            `   <tr><td scope="col">${item.nombre}</td>
                                                <td scope="col">$${item.valor_unitario.toLocaleString('es-CL')}</td>
                                                <td scope="col">${item.cantidad}</td>
                                                <td scope="col">$${(item.valor_total).toLocaleString('es-CL')}</td>
                                                </tr>`;
                                            $('#productos').append(product_html);                                
                                        }
                                    });
                                }
                            });
                        },
                        error: function(error) {
                            alert('Error al registrar su compra, revise los datos ingresados. Si posee una cuenta, intente iniciar sesión.');
                            return false;
                        }
                    });
                }
                $.ajax({
                    url: `${url}/comprar`,
                    type: 'POST',
                    data: {
                        user_id: user.id_usuario,
                        direccion: user.direccion,
                        comuna: user.comuna_id,
                        user_nombre: `${user.primer_nombre} ${user.apellido_paterno}`,
                        user_rut: user.rut,
                        carrito: carrito
                    },
                    success: function(data) {
                        alert('Compra realizada con éxito');
                        $('.modal').modal('hide');
                        localStorage.setItem('carrito', JSON.stringify([]));     
                        $('#productos').children().remove();
                        $('#eliminar').remove();
                        $('.title').text('Detalle Boleta');
                        data.forEach(function(item) {
                            if (item.nombre == 'undefined' || item.nombre == null) {
                                $('#subtotal').text("$"+ item.subtotal.toLocaleString('es-CL'));
                                $('#iva').text("$"+ item.iva.toLocaleString('es-CL'));
                                $('#total').text("$"+ item.total.toLocaleString('es-CL'));
                                voucher_html = `<th>Número de Voucher</th>
                                                <td>${item.voucher}</td>`;
                                $('#voucher').append(voucher_html);
                                seguimiento_html = `<th>Número de Seguimiento</th>
                                                <td>${item.id_despacho}</td>`;
                                $('#seguimiento').append(seguimiento_html);
                                $('#btn-pagar').remove();
                            } else {
                                product_html = 
                                `   <tr><td scope="col">${item.nombre}</td>
                                    <td scope="col">$${item.valor_unitario.toLocaleString('es-CL')}</td>
                                    <td scope="col">${item.cantidad}</td>
                                    <td scope="col">$${(item.valor_total).toLocaleString('es-CL')}</td>
                                    </tr>`;
                                $('#productos').append(product_html);                                
                            }
                        });
                    }
                });
            });
        },
        error: function(error) {
            product_html = '<tr><td colspan="7" style="text-align: center;">No hay productos en el carrito</td></tr>';
            $('#productos').append(product_html);
            }        
    });

    function cargarRegiones(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", `${url}/static/assets/regiones`, true);
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
        xmlhttp.open("GET", `${url}/static/assets/comunas`, true);
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

});