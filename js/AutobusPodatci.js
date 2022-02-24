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
    const date = new Date();
    /*const currHour = 23;
    const currMin = 0;
    const currDay = 6;*/  //DEBUG
    const currHour = date.getHours();
    const currMin = date.getMinutes();
    const currDay = date.getDay();
    const minHour = Number(data[4][0].slice(0, -1));
    const maxHour = Number(data[data.length-3][0].slice(0, -1));
    let dayIndex;


    // a) je li isti sat
    if(currDay == 6)
        dayIndex = 2;
    else if(currDay == 0)
        dayIndex = 3;
    else
        dayIndex = 1;
    
    let cellDataArr = data[4+currHour-minHour][dayIndex].split(", ");   // vremena pocinju od indeksa 4
    for(let i = 0; i<cellDataArr.length; i++)
    {
        cellDataArr[i] = cellDataArr[i].substring(0, 2);
        if(Number(cellDataArr[i])-currMin>0)
        {
            return cellDataArr[i]-currMin;
        }
    }

    // b) je li postoji/unutar 7 dana
    let passedHours = 0;
    let day = currDay;
    let hour = currHour;
    do
    {
        hour++;
        if(hour>maxHour)
        {
            passedHours += 23-maxHour+minHour; // 24-(maxHour+1)+minHour
            hour = minHour;
            day++;
            if(day==7)
                day = 0;
            
            if(day == 6)
                dayIndex = 2;
            else if(day == 0)
                dayIndex = 3;
            else
                dayIndex = 1;
        }
        const value = data[4+hour-minHour][dayIndex].substring(0, 2);
        if(value!="" && !isNaN(Number(value)))
        {
            return 60-currMin + passedHours*60 + Number(value);
        }
        passedHours++;
    }
    while(day!=currDay || hour!=currHour);   // !(A && B) = !A || !B

    // c) ne postoji/nije unutar 7 dana
    return -1;
}

function PrintNextLineTime(time = Number())
{
    if(time == -1)
    {
        tekstSljedeceLinije.innerHTML = "Nema nijedna linija sljedećih 7 dana."
        return;
    }
    
    let message = "Sljedeći autobus polazi za ";
    
    const days = parseInt(time/60/24);
    const hours = parseInt(time/60%24);
    const min = parseInt(time%60);

    if (days!=0)
    {
        message += days;

        // provjera za gramaticki tocan ispis rijeci
        if(days%10 == 1 && parseInt(days%100/10) != 1)
            message += " dan";
        else
            message += " dana";

        if(hours!=0 && min!=0)
            message += ", ";
        else if(hours!=0 || min!=0)
            message += " i ";
        else
            message += ".";
    }

    if (hours!=0)
    {
        message += hours;

        // provjera za gramaticki tocan ispis rijeci
        if(hours%10 == 1 && parseInt(hours%100/10) != 1)
            message += " sat";
        else if(hours%10 < 5 && hours%10 > 1 && parseInt(hours%100/10) != 1)
            message += " sata";
        else
            message += " sati";

        if(min!=0)
            message += " i ";
        else
            message += ".";
    }

    if(min!=0)
    {
        message += min;

        // provjera za gramaticki tocan ispis rijeci
        if (min%10 == 1 && parseInt(min%100/10) != 1)
            message += " minutu.";
        else if (min%10 < 5 && min%10 > 1 && parseInt(min%100/10) != 1)
            message += " minute.";
        else
            message += " minuta.";
    }

    tekstSljedeceLinije.innerHTML = message + "<br>" + napomena;
}