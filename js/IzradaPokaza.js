M.AutoInit();

document.getElementById("izrada").addEventListener("click", uzimanjePodataka);

function uzimanjePodataka() {
    let ime = document.getElementsByName("ime");
    let prezime = document.getElementsByName("prezime");
    let mjesto = document.getElementsByName("mjesto");
    let datum = document.getElementsByName("datum");
    let oib = document.getElementsByName("oib");
    
    localStorage.setItem("ime", ime);
    localStorage.setItem("prezime", prezime);
    localStorage.setItem("mjesto", mjesto);
    localStorage.setItem("datum", datum);
    localStorage.setItem("oib", oib);

    location.replace("pokaz.html");
  
}

