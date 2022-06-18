const url = localStorage.getItem('url');
$(document).ready(function() {

    carrito = JSON.parse(localStorage.getItem('carrito'));
    $.ajax({
        url: `${url}/carrito`,
        type: 'POST',
        data: {
            carrito: carrito
        },
        success: function(data) {
            console.log(data);
            //for each y cargar los productos en la pagina

        }
    });

    /*$('#eliminar').click(function() {
        $('#productos').children().each(function(index, el) {
            $(el).remove();
        });
    });*/
});