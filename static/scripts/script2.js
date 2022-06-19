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
            console.log(data);
            data.forEach(function(producto) {
                product_html = 
                `   <tr><td scope="col">${producto.nombre}</td>
                    <td scope="col">$${producto.valor_venta.toLocaleString('es-CL')}</td>
                    <td scope="col">${producto.cantidad}</td>
                    <td scope="col">${producto.valor * producto.cantidad}</td>
                    <td scope="col" style="color: rgb(250, 1, 1)"><i class="fa-solid fa-delete-left ps-4 clickable" id="eliminar"></i></td>
                    </tr>`;
                $('#productos').append(product_html);
                }
            );
            //for each y cargar los productos en la pagina

        }     
    });

    /*$('#eliminar').click(function() {
        $('#productos').children().each(function(index, el) {
            $(el).remove();
        });
    });*/
});