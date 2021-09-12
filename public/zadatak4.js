var predmeti = [];
var aktivnosti = [];
var div = document.getElementById("div1");

window.onload= function () {
    //ucitavanje predmeta u niz
    var ajaxPredmeti = new XMLHttpRequest();
    ajaxPredmeti.onreadystatechange = function() {
    if (ajaxPredmeti.readyState == 4 && ajaxPredmeti.status == 200) {
        predmeti=JSON.parse(ajaxPredmeti.responseText);
    }            
    if (ajaxPredmeti.readyState == 4 && ajaxPredmeti.status == 404)
        console.log("greska");
    }
    ajaxPredmeti.open('GET', "http://localhost:3000/v1/predmeti", true);
    ajaxPredmeti.setRequestHeader("Content-type", "application/json");
    ajaxPredmeti.send();

    //ucitavanje aktivnosti u niz
    var ajaxAktivnosti = new XMLHttpRequest();
    ajaxAktivnosti.onreadystatechange = function() {
        if (ajaxAktivnosti.readyState == 4 && ajaxAktivnosti.status == 200) {
            aktivnosti = JSON.parse(ajaxAktivnosti.responseText);
        }            
        if (ajaxAktivnosti.readyState == 4 && ajaxAktivnosti.status == 404)
            console.log("greska");
    }
    ajaxAktivnosti.open('GET', "http://localhost:3000/v1/aktivnosti", true);
    ajaxAktivnosti.setRequestHeader("Content-type", "application/json");
    ajaxAktivnosti.send();
}

function daLiPostojiPredmet (predmet) {
    let postoji=false;
    for (let i=0; i<predmeti.length; i++) {
        if (predmeti[i].naziv.toLowerCase()==predmet.toLowerCase()) {
            postoji=true;
            break;
        }
    }
    return postoji;
}

function dodajPredmet (predmetJSON, predmet) {
    var ajaxDodajPredmet = new XMLHttpRequest();
    var dodanPredmet=true;
    ajaxDodajPredmet.onreadystatechange = function() {         
        if (ajaxDodajPredmet.readyState == 4 && ajaxDodajPredmet.status == 404) {
            dodanPredmet=false;
        }
    }
    ajaxDodajPredmet.open("POST", "http://localhost:3000/v1/predmet", true);
    ajaxDodajPredmet.setRequestHeader("Content-type", "application/json");
    ajaxDodajPredmet.send(predmetJSON);
    if (dodanPredmet)
        predmeti.push(predmet);
    return dodanPredmet;
}

function obrisiPredmet (predmet) {
    var ajaxObrisiPremdet = new XMLHttpRequest();
    ajaxObrisiPremdet.open("DELETE", "http://localhost:3000/v1/predmet/"+predmet, true);
    ajaxObrisiPremdet.send();
}

function provjeriVrijeme (vrijeme) {
    if (Number.isInteger(vrijeme) ||  (vrijeme - Math.floor(vrijeme))==0.5)
        return true;
    return false;
}

function validirajAktivnost (nova) {
    //da li su vrijeme pocetka i kraja cijeli brojevi ili sa decimalnim dijelom 0.5
    if ( !provjeriVrijeme(nova.pocetak) || !provjeriVrijeme(nova.kraj))
        return false;
    //da li su unutar opsega od 8 do 21 i da li je dan od pon do ned
    if (parseInt(nova.pocetak)>=parseInt(nova.kraj) || parseInt(nova.pocetak)<8 || parseInt(nova.pocetak)>=21 || parseInt(nova.kraj)<=8 || parseInt(nova.kraj)>21) 
        return false;
    //preklapanje aktivnosti
    if (aktivnosti.length!=0) {
        for(let i = 0; i< aktivnosti.length; i++) {
            var pocetak=aktivnosti[i].pocetak;
            var kraj=aktivnosti[i].kraj;
            var dan=aktivnosti[i].dan;
            if (dan.toLowerCase()==nova['dan'].toLowerCase()) {
                if ((nova['pocetak']>pocetak && nova['pocetak']<kraj) || (nova['kraj']>pocetak && nova['kraj']<kraj) 
                    || (nova['pocetak']<pocetak && nova['kraj']>kraj) ||  (nova['pocetak']>pocetak && nova['kraj']<kraj)
                    || nova['pocetak']==pocetak || nova['kraj'==kraj])
                        return false;
            }
        }
    }
    return true;
}

function dodajAktivnost () {
    var uneseniPredmet=document.getElementById('predmet').value;
    var pocetak=document.getElementById('pocetak').value;
    var satiPocetak = parseInt(pocetak.split(":")[0]);
    var minutePocetak = parseInt(pocetak.split(":")[1]);
    var kraj=document.getElementById('kraj').value;
    var satiKraj = parseInt(kraj.split(":")[0]);
    var minuteKraj = parseInt(kraj.split(":")[1]);
    var nova = {
        naziv: uneseniPredmet,
        tip: document.getElementById('tipovi').value,
        pocetak: satiPocetak+minutePocetak/60,
        kraj: satiKraj+minuteKraj/60,
        dan: document.getElementById('dani').value
    };
    if (validirajAktivnost(nova)) { 
        var postoji=daLiPostojiPredmet(uneseniPredmet);  
        var dodanPredmet=true; 
        if (!postoji) {
            let novi={
                naziv: uneseniPredmet
            };
            noviJSON=JSON.stringify(novi);
            dodanPredmet=dodajPredmet(noviJSON,novi);
        }
        //ako vec postoji predmet ili ako predmet ne postoji i uspjesno je dodan
        if (postoji || (!postoji && dodanPredmet)) {            
            novaJSON=JSON.stringify(nova);       
                var ajaxDodajAktivnost = new XMLHttpRequest();
                ajaxDodajAktivnost.onreadystatechange = function () {
                    if (ajaxDodajAktivnost.readyState == 4 && ajaxDodajAktivnost.status == 200) {
                    var odgovor=JSON.parse(ajaxDodajAktivnost.responseText);
                    if (odgovor.message=="Aktivnost nije validna!") {
                        div.innerHTML="Aktivnost nije dodana!";
                        if (!postoji) {
                            obrisiPredmet(uneseniPredmet);
                        }
                    } else {
                        div.innerHTML="Uspješno dodana aktivnost!";
                        aktivnosti.push(nova);
                    }
                }
            }
            ajaxDodajAktivnost.open("POST", "http://localhost:3000/v1/aktivnost", true);
            ajaxDodajAktivnost.setRequestHeader("Content-type", "application/json");
            ajaxDodajAktivnost.send(novaJSON);
        }
    } else 
        div.innerHTML="Aktivnost nije validna!";
    document.getElementById("forma").reset();
}
