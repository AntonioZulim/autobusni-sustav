let tablica = document.getElementById("tabVozniRed");
let imeLinije = document.getElementById("imeLinije");
let dodatneInfo = document.getElementById("dodatneInfo");
let tekstSljedeceLinije = document.getElementById("sljedecaLinija");

let napomena = "(Napomena: Ne uračunavanju se blagdani.)"

function ReadCSVFile(url)
{
    fetch(url)
        .then(response => response.text())  // cekamo odgovor pa trazimo tekst
        .then(data => ManipulateTimetableData(data)); // odgovor prosljedujemo u drugu funkciju
}

function ManipulateTimetableData(timetableData)
{
    let timeToNextLine;
    timetableData = ConvertData(timetableData);
    ShowData(timetableData);
    timeToNextLine = CalculateNextLineTime(timetableData);
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

    let tabHeadRow = document.createElement("tr");
    for(let i = 0; i<data[2].length; i++)   // ispisuje header tablice
    {
        let tabCell = document.createElement("th");
        tabCell.innerHTML = data[2][i];
        tabHeadRow.appendChild(tabCell);
    }
    tablica.appendChild(tabHeadRow);

    let tabBody = document.createElement("tbody");
    for(let i = 3; i<data.length-2; i++)    // ispisuje tijelo tablice
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

    dodatneInfo.innerHTML = data[0][0]  + `<br><br>` + data[data.length-2][0] + `<br>` + data[data.length-1][0];
}

function CalculateNextLineTime(data)
{
    let vrijeme = new Date();
    let sat = vrijeme.getHours();
    let min = vrijeme.getMinutes();
    let dan = vrijeme.getDay();
    let minKretanja = [];
    let isInSameHour = false;
    let isHourInTable = false;
    let satIndex = Number();
    let danIndex;

    // provjera koji je dan
    if(dan == 6)
        danIndex = 2;
    else if(dan == 0)
        danIndex = 3;
    else
        danIndex = 1;

    // trazenje indeksa za trenutacni sat
    for(satIndex = 4; satIndex<data.length-3; satIndex++)
    {
        if(data[satIndex][0] == sat.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":")
        {
            isHourInTable = true;
            break;
        }
    }

    if(isHourInTable)
    {
        // provjera je li sljedeca linija u isti sat
        minKretanja = data[satIndex][danIndex].split(', ').map(Number);
        for(let i = 0; i<minKretanja.length; i++)
        {
            if(minKretanja[i]-min>0)
            {
                min = minKretanja[i]-min;
                isInSameHour = true;
                break;
            }
        }
    }
    else    // ako trenutni sat nije u tablici
    {
        satIndex = 3;
    }

    // ako sljedeca linija ne krece isti sat
    if(!isInSameHour)
    {
        do
        {
            if(satIndex==data.length-4) // sljedeci dan
            {
                satIndex = 3;
                dan = dan > 6 ? 0 : dan + 1;
                if (dan == 6)
                    danIndex = 2;
                else if (dan == 0)
                    danIndex = 3;
                else
                    danIndex = 1;
            }
            
            satIndex++;
            minKretanja = data[satIndex][danIndex].split(', ');
        }
        while(minKretanja=="");

        minKretanja = minKretanja.map(Number);
        min = 60-min+minKretanja[0];
    }

    // konacno racunanje vremena do sljedece linije
    sat = data[satIndex][0].split(':').map(Number)[0] - sat;
    if(sat<0)   sat+=24;
    if(!isInSameHour)   sat--;
    if(min>=60)
    {
        min-=60;
        sat++;
    }

    return sat*60+min;
}

function PrintNextLineTime(time = Number())
{
    let porukaZaLiniju = "Sljedeći autobus polazi s kolodvora za ";
    
    let sat = parseInt(time/60);
    let min = parseInt(time%60);
    if (sat!=0)
    {
        porukaZaLiniju += sat;

        // provjera za gramaticki tocan ispis rijeci
        if(sat%10 == 1 && parseInt(sat%100/10) != 1)
            porukaZaLiniju += " sat";
        else if(sat%10 < 5 && sat%10 > 1 && parseInt(sat%100/10) != 1)
            porukaZaLiniju += " sata";
        else
            porukaZaLiniju += " sati";

        if(min!=0)
            porukaZaLiniju += " i ";
        else
            porukaZaLiniju += ".";
    }

    if(min!=0)
    {
        porukaZaLiniju += min;

        // ponovna provjera za gramaticki tocan ispis rijeci
        if (min%10 == 1 && parseInt(min%100/10) != 1)
            porukaZaLiniju += " minutu.";
        else if (min%10 < 5 && min%10 > 1 && parseInt(min%100/10) != 1)
            porukaZaLiniju += " minute.";
        else
            porukaZaLiniju += " minuta.";
    }

    tekstSljedeceLinije.innerHTML = porukaZaLiniju + "<br>" + napomena;
}