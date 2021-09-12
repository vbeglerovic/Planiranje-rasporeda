//pomocne funkcije
function provjeriSat (sat) {
    if (sat>=0 && sat<=24) 
        return true;
    return false;
}

function provjeriVrijeme (vrijeme) {
    if (Number.isInteger(vrijeme) ||  (vrijeme - Math.floor(vrijeme))==0.5)
        return true;
    return false;
}


//glavne funkcije
function iscrtajRaspored (div,dani,satPocetak,satKraj) {
    if (!Number.isInteger(satPocetak) || !Number.isInteger(satKraj) || !provjeriSat(satPocetak) || !provjeriSat(satKraj) || satPocetak>=satKraj) {
        div.innerHTML="Greška";
        return;
    }
    var raspored=document.createElement("table");
    var brojKolona=(satKraj-satPocetak)*2+1;
    var brojRedova=dani.length;
    var prviRed=document.createElement("tr");
    for (i = 0; i < brojKolona; i++) {
        var polje = document.createElement("th");
        if (i%2===0 && i!=brojKolona-1) {
            var sat=satPocetak+i/2;
            if ((sat>=0 && sat<=13 && sat%2===0) || (sat>13 && sat<=24 && sat%2!==0)) {
                var tekst = document.createTextNode(String(satPocetak+i/2).padStart(2, '0')+":"+"00");
                polje.appendChild(tekst);
                polje.colSpan="2";
                i++;
            }
        }
        prviRed.appendChild(polje);
    }
    raspored.appendChild(prviRed);
    for (var i = 0; i < brojRedova; i++) {
        var red = document.createElement("tr");
        for (var j = 0; j < brojKolona; j++) {
            var polje = document.createElement("td");
            if (j===0) {
                var nazivDana = document.createTextNode(dani[i]);
                polje.appendChild(nazivDana);
            }
            red.appendChild(polje);
        }
    raspored.appendChild(red);
  }    
  div.appendChild(raspored);
}



function  dodajAktivnost (raspored, naziv, tip, vrijemePocetak, vrijemeKraj,dan) {
    if (raspored===null || !raspored.hasChildNodes()) {
        alert("Greška - raspored nije kreiran");
        return;
    }
    if (!provjeriSat(vrijemePocetak) || !provjeriSat(vrijemeKraj) || vrijemePocetak>=vrijemeKraj || !provjeriVrijeme(vrijemePocetak) || !provjeriVrijeme(vrijemeKraj)) {
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        return;
    }
    var x=false;
    var tabela=raspored.getElementsByTagName("table")[0];
    var brojRedova=tabela.childElementCount;
    for (var i = 1; i <brojRedova; i++) {
        if (tabela.childNodes[i].firstChild.innerHTML==dan) {
            x=true;                
            break;
        }
    }
    if (!x) {
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        return;
    }    
    //da li je aktivnost unutar dozvoljenog opsega
    var prviRed=tabela.firstChild;
    var prazneCelije1=0;
    var pocetniSat=null;
    for (i = 0; i<prviRed.childElementCount; i++) {
        if (prviRed.childNodes[i].innerHTML==="")
            prazneCelije1++;
        else {
            pocetniSat=parseInt(prviRed.childNodes[i].innerHTML.split(":")[0]);
            break;
        }
    }
    var krajnjiSat=null;
    var prazneCelije2=0;
    for (i = prviRed.childElementCount-1; i>=0; i--) {
        if (prviRed.childNodes[i].innerHTML==="")
            prazneCelije2++;
        else {
            krajnjiSat=parseInt(prviRed.childNodes[i].innerHTML.split(":")[0]);
            break;
        }
    }
    if ((pocetniSat-prazneCelije1/2)>vrijemePocetak || Math.round(krajnjiSat+prazneCelije2/2)<vrijemeKraj) {
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        return;
    }
    pocetniSat=pocetniSat-prazneCelije1/2;
    krajnjiSat=Math.round(krajnjiSat+prazneCelije2/2);
    for (i = 1; i <brojRedova; i++) {
        if (tabela.childNodes[i].firstChild.innerHTML==dan) {
            var odgovarajuciRed=tabela.childNodes[i];                 
           for (var j = 1; j <odgovarajuciRed.childElementCount; j++) {
                if (!odgovarajuciRed.childNodes[j].classList.contains("umetnuti")) {                   
                        var brojSpojenihKolona=odgovarajuciRed.childNodes[j].colSpan;
                        if (pocetniSat==vrijemePocetak ) {                  
                            var trajanje=vrijemeKraj-vrijemePocetak;
                            if (brojSpojenihKolona!=1 && !odgovarajuciRed.childNodes[j].classList.contains("popunjeni"))
                                j=j+brojSpojenihKolona;   
                            for ( var k = j; k<j+trajanje*2; k++) {
                                if (odgovarajuciRed.childNodes[k].classList.contains("popunjeni") || odgovarajuciRed.childNodes[k].classList.contains("umetnuti")) {
                                    alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
                                    return;
                                }  
                            }                                
                            var odgovarajucePolje=odgovarajuciRed.childNodes[j];
                            odgovarajucePolje.colSpan=trajanje/0.5;
                            for (k = j + 1;  k <j + trajanje/0.5; k++) {
                                if (vrijemeKraj!=krajnjiSat)
                                    odgovarajuciRed.childNodes[k].classList.add("umetnuti");
                                else
                                    odgovarajuciRed.removeChild(odgovarajuciRed.lastChild);
                            }
                            var predmet=document.createElement("h3");
                            predmet.innerHTML=naziv;
                            var vrsta=document.createElement("h5");
                            vrsta.innerHTML=tip;
                            odgovarajucePolje.appendChild(predmet);
                            odgovarajucePolje.appendChild(vrsta);
                            odgovarajucePolje.classList.add("popunjeni");                         
                            break;
                        } else if (vrijemePocetak<pocetniSat) {
                            alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
                            return;
                        } else
                            pocetniSat=pocetniSat+brojSpojenihKolona*0.5;
                }
            }          
            break;
        }
    }
}