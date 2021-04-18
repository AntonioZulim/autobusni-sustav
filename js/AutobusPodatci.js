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
    let isTimetableEmpty = false;
    let satIndex = Number();
    let danIndex;
    let prosloSati = 0;

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
        minKretanja = data[satIndex][danIndex].split(', ');
        for(let i = 0; i<minKretanja.length; i++)
        {
            let minBroj = minKretanja[i].split(/ |-/);
            minKretanja[i] = Number(minBroj[0]);
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
        let minBroj;
        
        do
        {
            if(satIndex==data.length-3) // sljedeci dan
            {
                prosloSati += 23 - data[satIndex][0].split(':').map(Number)[0] + data[4][0].split(':').map(Number)[0];
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
            prosloSati++;
            minKretanja = data[satIndex][danIndex].split(', ');
            minBroj = minKretanja[0].split(/ |-/);
            if(prosloSati==7*24)
            {
                isTimetableEmpty = true;
                break;
            }
        }
        while(minKretanja=="" || isNaN(minBroj[0]));

        minKretanja[0] = Number(minBroj[0]);
        min = 60-min+minKretanja[0];
        prosloSati--;
    }

    // konacno racunanje vremena do sljedece linije
    sat = data[satIndex][0].split(':').map(Number)[0] - sat + prosloSati;
    if(sat<0)   sat+=24;
    if(!isInSameHour)   sat--;
    if(min>=60)
    {
        min-=60;
        sat++;
    }

    if(isTimetableEmpty)
    {
        sat = 0;
        min = -1;
    }

    return sat*60+min;
}

function PrintNextLineTime(time = Number())
{
    if(time == -1)
        return;
    
    let porukaZaLiniju = "Sljedeći autobus polazi za ";
    
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