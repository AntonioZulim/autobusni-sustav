let table = document.getElementById("tabVozniRed");
let nameOfLine = document.getElementById("imeLinije");
let lineInfo = document.getElementById("dodatneInfo");
let nextLineText = document.getElementById("sljedecaLinija");
let nextLineNote = "(Napomena: Ne uračunavanju se blagdani.)";

const firebaseConfig = {
    apiKey: "AIzaSyD3kfC_lNAwfoqcQjCFnhdQO0umNerwgVs",
    authDomain: "bus-timetable-8cb0f.firebaseapp.com",
    projectId: "bus-timetable-8cb0f",
    storageBucket: "bus-timetable-8cb0f.appspot.com",
    messagingSenderId: "697543428444",
    appId: "1:697543428444:web:99d4d468e13d9a4fab5999"
};
const app = firebase.initializeApp(firebaseConfig);
const database = app.firestore();

function GetBusLine(lineIndex)
{
    let line = database.collection("bus-lines").doc("line" + lineIndex.toString().padStart(2, '0'));
    line.get().then(doc => {
        if(doc.exists){
            ManipulateTimetableData(doc.data());
            console.log(doc.data());
        }
        else{
            console.log("Error: Line does not exist");
        }
    });
}

function ManipulateTimetableData(timetableData)
{
    let timeToNextLine;
    ShowData(timetableData);
    timeToNextLine = CalculateNextLineTime(timetableData);
    PrintNextLineTime(timeToNextLine);
}

function ShowData(data)
{
    nameOfLine.innerHTML = data.name;   // ispisuje ime linije
    
    table.innerHTML = ""; // brise sve iz tablice

    let headerText = ["", "RADNI DAN<br>Working Day", "SUBOTA<br>Saturday", "NEDJELJA I BLAGDANI<br>Sunday & Holidays"];
    let tabHeadRow = document.createElement("tr");
    for(let i = 0; i<4; i++)   // ispisuje header tablice
    {
        let tabCell = document.createElement("th");
        tabCell.innerHTML = headerText[i];
        tabHeadRow.appendChild(tabCell);
    }
    table.appendChild(tabHeadRow);
    
    headerText = ["sati<br>(hours)", "", "minute (minutes)", ""];
    tabHeadRow = document.createElement("tr");
    for(let i = 0; i<4; i++)
    {
        let tabCell = document.createElement("td");
        tabCell.innerHTML = headerText[i];
        tabHeadRow.appendChild(tabCell);
    }
    table.appendChild(tabHeadRow);

    for(let i = 4; i<24; i++)    // ispisuje tijelo tablice
    {
        let tabRow = document.createElement("tr");

        let cell = document.createElement("td");
        cell.innerText = i.toString().padStart(2, '0') + ":";
        tabRow.appendChild(cell);
        
        cell = document.createElement("td");
        cell.innerHTML = data.week["h" + i.toString().padStart(2, '0')].join(", ");
        tabRow.appendChild(cell);
        
        cell = document.createElement("td");
        cell.innerHTML = data.sat["h" + i.toString().padStart(2, '0')].join(", ");
        tabRow.appendChild(cell);
        
        cell = document.createElement("td");
        cell.innerHTML = data.sun["h" + i.toString().padStart(2, '0')].join(", ");
        tabRow.appendChild(cell);
        
        table.appendChild(tabRow);
    }
    for(let i = 0; i<table.rows.length; i++)
    {
        let cell = table.rows[i].cells[0];
        cell.setAttribute("class", "sati");
    }

    lineInfo.innerHTML = data.message.split(",").join("<br>");
}

function CalculateNextLineTime(data)
{
    const date = new Date();
    const currHour = date.getHours();
    const currMin = date.getMinutes();
    const currDay = date.getDay();
    const minHour = 4;  // najraniji sat u tablici
    const maxHour = 23; // najkasniji sat u tablici
    let dayName;


    // a) je li isti sat
    if(currDay == 6)
        dayName = "sat";
    else if(currDay == 0)
        dayName = "sun";
    else
        dayName = "week";
    
    let cellDataArr = data[dayName]["h" + currHour.toString().padStart(2, '0')];
    for(let i = 0; i<cellDataArr.length; i++)
    {
        cellDataArr[i] = cellDataArr[i].toString().substring(0, 2);
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
                dayName = 2;
            else if(day == 0)
                dayName = 3;
            else
                dayName = 1;
        }
        const value = data[dayName]["h" + hour.toString().padStart(2, '0')][0];
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
        nextLineText.innerHTML = "Nema nijedna linija sljedećih 7 dana."
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

    nextLineText.innerHTML = message + "<br>" + nextLineNote;
}