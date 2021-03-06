let link = "https://raw.githubusercontent.com/AntonioZulim/autobusni-sustav-podatci/main/vozni-red/";

let odabir = document.getElementById("odabir");


odabir.addEventListener("change", () => 
{
    let ime = "vozni_red" + odabir.value + ".csv";
    ReadCSVFile(link + ime);    // poziva funkciju iz AutobusPodatci.js
})