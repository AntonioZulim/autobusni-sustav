let tablica = document.getElementById("tabVozniRed");
let imeLinije = document.getElementById("imeLinije");
let dodatneInfo = document.getElementById("dodatneInfo");
let tekstSljedeceLinije = document.getElementById("sljedecaLinija");

let porukaZaLiniju = "Sljedeći autobus polazi s kolodvora za ";

function ReadCSVFile(url)
{
    fetch(url)
        .then(response => response.text())  // cekamo odgovor pa trazimo tekst
        .then(data => ManipulateTimetableData(data)); // odgovor prosljedujemo u drugu funkciju
}

function ManipulateTimetableData(TimetableData)
{
    let timeToNextLine;
    TimetableData = ConvertData(TimetableData);
    ShowData(TimetableData);
    timeToNextLine = CalculateNextLineTime(TimetableData);
    PrintNextLineTime(timeToNextLine);
}

function ConvertData(data = "")
{
    let redovi = data.split(/\r\n|\r|\n/g);
    let podatci = Array();
    for(i in redovi)
    {
        podatci[i] = redovi[i].split(';');
    }
    return podatci;
}

function ShowData(data = [[]])
{
    imeLinije.innerHTML = data[1][0];   // ispisuje ime linije
    
    tablica.innerHTML = ""; // brise sve iz tablice

    let tabHead = document.createElement("thead");
    let tabHeadRow = document.createElement("tr");
    for(let i = 0; i<data[2].length; i++)   // ispisuje header tablice
    {
        let tabCell = document.createElement("th");
        tabCell.innerHTML = data[2][i];
        tabHeadRow.appendChild(tabCell);
    }
    tablica.appendChild(tabHeadRow);

    let tabBody = document.createElement("tbody");
    for(let i = 3; i<data.length-3; i++)    // ispisuje tijelo tablice
    {
        let tabRow = document.createElement("tr");
        for(let j = 0; j<data[i].length; j++)
        {
            let tabCell = document.createElement("td");
            tabCell.innerHTML = data[i][j];
            if(j==0)
            {
                tabCell.setAttribute("class", "sati");
            }
            tabRow.appendChild(tabCell);
        }
        tabBody.appendChild(tabRow);
    }
    tablica.appendChild(tabBody);

    dodatneInfo.innerHTML = data[0][0]  + `<br><br>` + data[data.length-3][0] + `<br>` + data[data.length-2][0];
}

function CalculateNextLineTime(data)
{
    let vrijeme = new Date();
    let sat = vrijeme.getHours();
    let min = vrijeme.getMinutes();
    let minKretanja = [];
    let isInSameHour = false;
    let satIndex = Number();

    // trazenje indeksa za trenutacni sat
    for(satIndex = 4; satIndex<data.length-3; satIndex++)
    {
        if(data[satIndex][0] == sat+":")
        {
            break;
        }
    }
  
    // provjera je li sljedeca linija u isti sat
    minKretanja = data[satIndex][1].split(', ').map(Number);
    for(let i = 0; i<minKretanja.length; i++)
    {
        if(minKretanja[i]-min>0)
        {
            min = minKretanja[i]-min;
            isInSameHour = true;
            break;
        }
    }

    // ako sljedeca linija ne krece isti sat
    if(!isInSameHour)
    {
        if(satIndex==data.length-4)
        {
            satIndex = 3;
        }
        satIndex++;
        minKretanja = data[satIndex][1].split(', ').map(Number);
        min = 60-min-minKretanja[0];
    }

    // konacno racunanje vremena do sljedece linije
    sat = data[satIndex][0].split(':').map(Number)[0] - sat;
    if(sat<0)   sat+=24;
    if(!isInSameHour)   sat--;
    
    return sat*60+min;
}

function PrintNextLineTime(time = Number())
{
    let sat = parseInt(time/60);
    let min = parseInt(time%60);
    if (sat > 0)
    {
        // provjera za gramaticki tocan ispis rijeci
        porukaZaLiniju += sat;
        if(sat%10 == 1 && sat%100/10 != 1)
            porukaZaLiniju += " sat i ";
        else if(sat%10 < 5 && sat%100/10 != 1)
            porukaZaLiniju += " sata i ";
        else
            porukaZaLiniju += " sati i ";
    }

    porukaZaLiniju += min;
    // ponovna provjera za gramaticki tocan ispis rijeci
    if (sat%10 == 1 && sat%100/10 != 1)
        porukaZaLiniju += " minutu.";
    else if (sat%10 < 5 && sat%100/10 != 1)
        porukaZaLiniju += " minute.";
    else
        porukaZaLiniju += " minuta.";

    tekstSljedeceLinije.innerHTML = porukaZaLiniju;
}