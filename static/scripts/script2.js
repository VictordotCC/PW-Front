const url = localStorage.getItem('url');
$(document).ready(function() {


    var carrito = JSON.parse(localStorage.getItem('carrito'));
    console.log(carrito);

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
            });
            

        }     
    });


});