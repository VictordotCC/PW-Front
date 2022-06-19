const url = localStorage.getItem('url');
$(document).ready(function() {


    var carrito = JSON.parse(localStorage.getItem('carrito'));
    
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
                }
            );
            $('#subtotal').text("$"+ subtotal.toLocaleString('es-CL'));
            $('#iva').text("$"+ (Math.round(subtotal * 0.19)).toLocaleString('es-CL'));
            $('#total').text("$"+ (Math.round(subtotal * 1.19)).toLocaleString('es-CL'));

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
                    
                if ($('#productos').children().length == 0) {
                    $('#productos').append('<tr><td colspan="7" style="text-align: center;">No hay productos en el carrito</td></tr>');
                }
            });       

        },
        error: function(error) {
            product_html = '<tr><td colspan="7" style="text-align: center;">No hay productos en el carrito</td></tr>';
            $('#productos').append(product_html);
            }    
    });


});