let link = "https://raw.githubusercontent.com/AntonioZulim/autobusni-sustav-podatci/main/vozni-red/";
let odabir = document.getElementById("odabir");

// Poziva Materialize JS
M.AutoInit();

odabir.addEventListener("change", () => 
{
    let ime = "vozni_red" + odabir.value + ".csv";
    ReadCSVFile(link + ime);    // poziva funkciju iz AutobusPodatci.js
})