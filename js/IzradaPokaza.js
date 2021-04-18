M.AutoInit();


$(document).ready(function() {
    $('input#input_text, textarea#textarea2').characterCounter();
  });

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
  });


function uzimanjePodataka() {
    let ime = document.getElementsByName("ime");
    let prezime = documet.getElementsByName("prezime");
    let mjesto = documet.getElementsByName("mjesto");
    let datum = documet.getElementsByName("datum");
    let oib = document.getElementsByName("oib");
    console.log(ime);
    console.log(prezime);



    location.replace("pokaz.html");
  
}

documet.getElementById("izrada").addEventListener("click", uzimanjePodataka);