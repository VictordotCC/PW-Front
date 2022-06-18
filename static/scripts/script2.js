$(document).ready(function() {
    /*$('#eliminar').click(function() {
        $('#productos').children().each(function(index, el) {
            $(el).remove();
        });
    });*/
    cart2 = cart.replaceAll("'",'"');
    productos = JSON.parse(cart2);
    console.log(productos);
    //for each y cargar los productos en la pagina
});