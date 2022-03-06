//let link = "https://raw.githubusercontent.com/AntonioZulim/autobusni-sustav-podatci/main/vozni-red/";
let odabir = document.getElementById("odabir");
let ruta = document.getElementById("ruta");

// Poziva Materialize JS
M.AutoInit();

odabir.addEventListener("change", () => 
{
    GetBusLine(odabir.value);    // poziva funkciju iz AutobusPodatci.js

    PromjenaRute(odabir);
})

function PromjenaRute(odabir){
    switch (Number(odabir.value)) {
        case 0: ruta.src='Split_i_linije/linija1.png';
        break;
        case 1: ruta.src="Split_i_linije/linija2.png";
        break;
        case 2: ruta.src="Split_i_linije/linija2.png";
        break;
        case 4: ruta.src="Split_i_linije/linija3.png";
        break;
        case 5: ruta.src="Split_i_linije/linija3.png";
        break;
        case 6: ruta.src="Split_i_linije/linija5.png";
        break;
        case 7: ruta.src="Split_i_linije/linija5a.png";
        break;
        case 8: ruta.src="Split_i_linije/linija6.png";
        break;
        case 9: ruta.src="Split_i_linije/linija7.png";
        break;
        case 10: ruta.src="Split_i_linije/linija7.png";
        break;
        case 11: ruta.src="Split_i_linije/linija8.png";
        break;
        case 12: ruta.src="Split_i_linije/linija8.png";
        break;
        case 13: ruta.src="Split_i_linije/linija9.png";
        break;
        case 14: ruta.src="Split_i_linije/linija10.png";
        break;
        case 15: ruta.src="Split_i_linije/linija11.png";
        break;
        case 94: ruta.src="Split_i_linije/linija11.png";
        break;
        case 16: ruta.src="Split_i_linije/linija12.png";
        break;
        case 17: ruta.src="Split_i_linije/linija12.png";
        break;
        case 18: ruta.src="Split_i_linije/linija14.png";
        break;
        case 19: ruta.src="Split_i_linije/linija14.png";
        break;
        case 20: ruta.src="Split_i_linije/linija15.png";
        break;
        case 21: ruta.src="Split_i_linije/linija16.png";
        break;
        case 22: ruta.src="Split_i_linije/linija17.png";
        break;
        case 23: ruta.src="Split_i_linije/linija17.png";
        break;
        case 24: ruta.src="Split_i_linije/linija18.png";
        break;
        case 26: ruta.src="Split_i_linije/linija21.png";
        break;
        case 27: ruta.src="Split_i_linije/linija22.png";
        break;
        default: ruta.src="Split_i_linije/prazno.png";
        break;
    }
}
