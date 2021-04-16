let link = "https://raw.githubusercontent.com/AntonioZulim/autobusni-sustav-podatci/main/vozni-red/";
let odabir = document.getElementById("odabir");
let ruta = document.getElementById("ruta");

// Poziva Materialize JS
M.AutoInit();

odabir.addEventListener("change", () => 
{
    let ime = "vozni_red" + odabir.value + ".csv";
    ReadCSVFile(link + ime);    // poziva funkciju iz AutobusPodatci.js

    promjenaRute(odabir);
})

function promjenaRute(odabir){
    console.log(odabir.value);
    switch (odabir.value) {
        case 0: document.getElementById('ruta').src='Split_i_linije/linija1.png';
        break;
        case 1: ruta.src="Split_i_linije/linija2.png";
        break;
        case 2: ruta.src="Split_i_linije/linija2.png";
        break;
        case 3: ruta.src="Split_i_linije/linija3.png";
        break;
        case 4: ruta.src="Split_i_linije/linija3.png";
        break;
        case 5: document.getElementById('ruta').src="Split_i_linije/linija5.png";
        break;
        case 6: document.getElementById('ruta').src="Split_i_linije/linija5a.png";
        break;
        case 7: document.getElementById('ruta').src="Split_i_linije/linija6.png";
        break;
        case 8: document.getElementById('ruta').src="Split_i_linije/linija7.png";
        break;
        case 9: document.getElementById('ruta').src="Split_i_linije/linija7.png";
        break;
        case 10: document.getElementById('ruta').src="Split_i_linije/linija8.png";
        break;
        case 11: document.getElementById('ruta').src="Split_i_linije/linija8.png";
        break;
        case 12: document.getElementById('ruta').src="Split_i_linije/linija9.png";
        break;
        case 13: document.getElementById('ruta').src="Split_i_linije/linija10.png";
        break;
        case 14: document.getElementById('ruta').src="Split_i_linije/linija11.png";
        break;
        case 15: document.getElementById('ruta').src="Split_i_linije/linija11.png";
        break;
        case 16: document.getElementById('ruta').src="Split_i_linije/linija12.png";
        break;
        case 17: document.getElementById('ruta').src="Split_i_linije/linija12.png";
        break;
        case 18: document.getElementById('ruta').src="Split_i_linije/linija14.png";
        break;
        case 19: document.getElementById('ruta').src="Split_i_linije/linija14.png";
        break;
        case 20: document.getElementById('ruta').src="Split_i_linije/linija15.png";
        break;
        case 21: document.getElementById('ruta').src="Split_i_linije/linija16.png";
        break;
        case 22: document.getElementById('ruta').src="Split_i_linije/linija17.png";
        break;
        case 23: document.getElementById('ruta').src="Split_i_linije/linija17.png";
        break;
        case 24: document.getElementById('ruta').src="Split_i_linije/linija18.png";
        break;
        case 26: document.getElementById('ruta').src="Split_i_linije/linija21.png";
        break;
        case 27: document.getElementById('ruta').src="Split_i_linije/linija22.png";
        break;
        default: document.getElementById('ruta').src="Split_i_linije/prazno.png";
        break;
    }
}
