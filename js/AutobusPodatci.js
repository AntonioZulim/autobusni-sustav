let tablica = document.getElementById("tabVozniRed");
let imeLinije = document.getElementById("imeLinije");
let dodatneInfo = document.getElementById("dodatneInfo");

function ReadCSVFile(url)
{
    fetch(url)
        .then(response => response.text())  // cekamo odgovor pa trazimo tekst
        .then(data => ConvertData(data)); // odgovor prosljedujemo u drugu funkciju
}

function ConvertData(data = "")
{
    let redovi = data.split(/\r\n|\r|\n/g);
    let podatci = Array();
    for(i in redovi)
    {
        podatci[i] = redovi[i].split(';');
    }
    ShowData(podatci);
    CalculateNextLineTime(podatci);
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
    let isNextTimeFound = false;
    let satIndex = Number();

    for(satIndex = 4; satIndex<data.length-3; satIndex++)
    {
        if(data[satIndex][0] == sat+":")
        {
            break;
        }
    }
    satIndex = 22;  //DEBUG
    sat = 23;   //DEBUG
  
    minKretanja = data[satIndex][1].split(', ').map(Number);
    for(let i = 0; i<minKretanja.length; i++)
    {
        if(minKretanja[i]-min>0)
        {
            min = minKretanja[i]-min;
            isNextTimeFound = true;
            break;
        }
    }
    if(!isNextTimeFound)
    {
        if(satIndex==data.length-4)
        {
            satIndex = 3;
        }
        satIndex++;
        minKretanja = data[satIndex][1].split(', ').map(Number);
        min = min-minKretanja[0];
    }
    sat = data[satIndex][0].split(':').map(Number)[0] - sat;
    if(sat<0)   sat+=24;
    
    console.log(sat + " sati i " + min + " minuta");
    
}