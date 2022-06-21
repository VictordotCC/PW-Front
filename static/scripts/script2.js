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
                                    <label for="Direccion">Direccion</label>
                                    <input type="text" class="form-control" id="direccion" placeholder="Direccion">
                                    <label for="Region">Regi&oacute;n</label>
                                    <select class="form-select" id="Region" required>
                                        <option value="">Seleccione una Regi&oacute;n</option>
                                    </select><br>
                                    <label for="Comuna">Comuna</label>
                                    <select class="form-select" id="Comuna" required>
                                        <option value="">Seleccione una Comuna</option>
                                    </select>
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
                    $('#info').text(`Direccion: ${user.direccion}`);
                }
                $('#info').append(`<br>El total de la compra es: $<span id="total_modal">${total.toLocaleString('es-CL')}</span> y se enviara a la dirección indicada.`);
            });
            $('#confirmar').click(function() {
                if (user == null) {
                    var direccion = $('#direccion').val();
                    var region = $('#Region option:selected').text().slice(0, -1);
                    var comuna = $('#Comuna option:selected').text();
                    if (direccion == '' || region == '' || comuna == '') {
                        alert('Debe completar todos los campos');
                        return;
                    }
                }
                else {
                    var direccion = user.direccion;
                    var region = user.region;
                    var comuna = user.comuna;
                }
                //ajax to detalles de la compra
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