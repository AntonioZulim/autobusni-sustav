let link = "https://raw.githubusercontent.com/AntonioZulim/autobusni-sustav-podatci/main/vozni-red/vozni_red0.csv";

function ReadCSVFile(url)
{
    fetch(url)
        .then(response => response.text())  // cekamo odgovor pa trazimo tekst
        .then(data => SerializeData(data)); // odgovor prosljedujemo u drugu funkciju
}

function SerializeData(data = "")
{
    let redovi = data.split(/\r\n|\r|\n/g);
    let podatci = Array();
    for(i in redovi)
    {
        podatci[i] = redovi[i].split(';');
    }
    console.log(podatci);
}

// Poziva Materialize JS
M.AutoInit();

ReadCSVFile(link);