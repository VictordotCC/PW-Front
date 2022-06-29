var sumar;
//AÑADE UN CLICK AL EJECUTAR LA FUNCIÓN
function agregarCounter() {
  sumar += 1;
}
function restarCounter() {
  if (sumar > 0) {
    sumar -= 1;
  }
}
$(".sumar").click(function(){
  sumar = parseInt($(".counter-label").val());
  agregarCounter();
  $(".counter-label").val(sumar);
});

$(".restar").click(function(){
  sumar = parseInt($(".counter-label").val());
  restarCounter();
  $(".counter-label").val(sumar);
});

`<td scope="col" class="input-group"><input type="number" class="form-control counter-label" value="${producto.stock}">
<div class="input-group-append">
    <button type="button" class="btn btn-outline-success sumar">+</button>
    <button type="button" class="btn btn-outline-danger restar">-</button>
</div>
</td>`;