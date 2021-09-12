var predmeti = [];
var aktivnosti = [];
var div = document.getElementById("div1");
var tipovi=[];
var dani=[];
var grupePredmeti=[];
var nova;
var listaGrupa= document.getElementById("grupePredmeti");

window.onload= function () {
    //ucitavanje tipova u listu
    var ajaxTipovi = new XMLHttpRequest();
    ajaxTipovi.onreadystatechange = function() {
    if (ajaxTipovi.readyState == 4 && ajaxTipovi.status == 200) {
        tipovi=JSON.parse(ajaxTipovi.responseText);
        let lista= document.getElementById("tipovi");
        for (let i=0; i<tipovi.length; i++) {
            let opcija = document.createElement("option");
            opcija.text = tipovi[i]['naziv'];
            lista.add(opcija);
        }
    }            
    if (ajaxTipovi.readyState == 4 && ajaxTipovi.status == 404)
        console.log("greska");
    }
    ajaxTipovi.open('GET', "http://localhost:3000/v2/tipovi", true);
    ajaxTipovi.setRequestHeader("Content-type", "application/json");
    ajaxTipovi.send();

    //ucitavanje dana u listu
    var ajaxDani = new XMLHttpRequest();
    ajaxDani.onreadystatechange = function() {
    if (ajaxDani.readyState == 4 && ajaxDani.status == 200) {
        dani=JSON.parse(ajaxDani.responseText);
        let lista= document.getElementById("dani");
        for (let i=0; i<dani.length; i++) {
            let opcija = document.createElement("option");
            opcija.text = dani[i]['naziv'];
            lista.add(opcija);
        }
    }            
    if (ajaxDani.readyState == 4 && ajaxDani.status == 404)
        console.log("greska");
    }
    ajaxDani.open('GET', "http://localhost:3000/v2/dani", true);
    ajaxDani.setRequestHeader("Content-type", "application/json");
    ajaxDani.send();

    //ucitavanje predmet-grupa u listu
    var ajaxGrupaPredmet = new XMLHttpRequest();
    ajaxGrupaPredmet.onreadystatechange = function() {
    if (ajaxGrupaPredmet.readyState == 4 && ajaxGrupaPredmet.status == 200) {
        grupePredmeti=JSON.parse(ajaxGrupaPredmet.responseText);
        for (let i=0; i<grupePredmeti.length; i++) {
            let opcija = document.createElement("option");
            opcija.text = grupePredmeti[i]['predmet']['naziv']+"-"+grupePredmeti[i]['naziv'];
            listaGrupa.add(opcija);
        }
        let opcija = document.createElement("option");
            opcija.text = "-";
            listaGrupa.add(opcija);
    }            
    if (ajaxGrupaPredmet.readyState == 4 && ajaxGrupaPredmet.status == 404)
        console.log("greska");
    }
    ajaxGrupaPredmet.open('GET', "http://localhost:3000/grupaPredmet", true);
    ajaxGrupaPredmet.setRequestHeader("Content-type", "application/json");
    ajaxGrupaPredmet.send();    

    //ucitavanje predmeta u niz
    var ajaxPredmeti = new XMLHttpRequest();
    ajaxPredmeti.onreadystatechange = function() {
    if (ajaxPredmeti.readyState == 4 && ajaxPredmeti.status == 200) {
        predmeti=JSON.parse(ajaxPredmeti.responseText);
    }            
    if (ajaxPredmeti.readyState == 4 && ajaxPredmeti.status == 404)
        console.log("greska");
    }
    ajaxPredmeti.open('GET', "http://localhost:3000/v2/predmeti", true);
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
    ajaxAktivnosti.open('GET', "http://localhost:3000/v2/aktivnosti", true);
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
    ajaxDodajPredmet.open("POST", "http://localhost:3000/v2/predmet", true);
    ajaxDodajPredmet.setRequestHeader("Content-type", "application/json");
    ajaxDodajPredmet.send(predmetJSON);
    if (dodanPredmet)
        predmeti.push(predmet);
    return dodanPredmet;
}

function obrisiPredmet (predmet) {
    var ajaxObrisiPremdet = new XMLHttpRequest();
    ajaxObrisiPremdet.open("DELETE", "http://localhost:3000/v2/predmet/"+predmet, true);
    ajaxObrisiPremdet.send();
}

function obrisiGrupu (grupa) {
    var ajaxObrisiGrupu = new XMLHttpRequest();
    ajaxObrisiGrupu.open("DELETE", "http://localhost:3000/v2/grupa/"+grupa, true);
    ajaxObrisiGrupu.send();
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
    //da li su unutar opsega od 8 do 21
    if (parseInt(nova.pocetak)>=parseInt(nova.kraj) || parseInt(nova.pocetak)<8 || parseInt(nova.pocetak)>=21 || parseInt(nova.kraj)<=8 || parseInt(nova.kraj)>21) 
        return false;
    //preklapanje aktivnosti
    if (aktivnosti.length!=0) {
        for(let i = 0; i< aktivnosti.length; i++) {
            var pocetak=aktivnosti[i].pocetak;
            var kraj=aktivnosti[i].kraj;
            var dan=aktivnosti[i].danId;
            if (dan==nova['danId']) {
                if ((nova['pocetak']>pocetak && nova['pocetak']<kraj) || (nova['kraj']>pocetak && nova['kraj']<kraj) 
                    || (nova['pocetak']<pocetak && nova['kraj']>kraj) ||  (nova['pocetak']>pocetak && nova['kraj']<kraj)
                    || nova['pocetak']==pocetak || nova['kraj']==kraj)
                        return false;
            }
        }
    }
    return true;
}
function nadjiIdTipa(tip) {
    return tipovi.filter(t=>t.naziv==tip)[0]['id'];
}

function nadjiIdDana(dan) {
    return dani.filter(d=>d.naziv==dan)[0]['id'];
}

function nadjiIdPredmeta(predmet) {
    return predmeti.filter(p=>p.naziv==predmet)[0]['id'];
}

function dodajNovuOpciju(opcijaText){
    let opcija = document.createElement("option");
    opcija.text = opcijaText;
    listaGrupa.add(opcija);
}

function izbrisiOpciju() {
    let x = document.getElementById("grupePredmeti");
    x.remove(listaGrupa.length-1);
}

function dodajPredmetGrupu() {
    var predmetGrupa=document.getElementById('grupePredmeti').value;
    let okej=true;
    if (predmetGrupa=="-") {
        if (!document.getElementById('predmetGrupa').value.includes('-')) {
            div.innerHTML="Unesite predmet i grupu u formatu predmet-grupa!";
            okej=false;
        }
        else
            predmetGrupa=document.getElementById('predmetGrupa').value;
    }
    if (okej) {
        let predmet=predmetGrupa.split("-")[0];
        let grupa=predmetGrupa.split("-")[1];
        var postoji=daLiPostojiPredmet(predmet); 
        if (!postoji) {
            let novi= {
                naziv: predmet
            };
            var ajaxDodajPredmet = new XMLHttpRequest();
            ajaxDodajPredmet.onreadystatechange = function() {         
                if (ajaxDodajPredmet.readyState == 4 && ajaxDodajPredmet.status == 200) {   
                    let noviPredmet =JSON.parse(ajaxDodajPredmet.responseText);
                    predmeti.push(noviPredmet);
                    //treba dodati grupu
                    var ajaxDodajGrupu = new XMLHttpRequest();
                    let nova ={
                        naziv: grupa,
                        predmetId: noviPredmet.id
                    };
                    ajaxDodajGrupu.onreadystatechange = function() {   
                        if (ajaxDodajGrupu.readyState == 4 && ajaxDodajGrupu.status == 200) {
                            let novaGrupa = JSON.parse(ajaxDodajGrupu.responseText);
                            grupePredmeti.push(novaGrupa);
                            dodajNovuOpciju(predmet+"-"+grupa);
                            dodajAktivnost(grupa,predmet,false,true);
                        } 
                    }
                    ajaxDodajGrupu.open("POST", "http://localhost:3000/grupa", true);
                    ajaxDodajGrupu.setRequestHeader("Content-type", "application/json");
                    ajaxDodajGrupu.send(JSON.stringify(nova));
                }
            }
            ajaxDodajPredmet.open("POST", "http://localhost:3000/predmet", true);
            ajaxDodajPredmet.setRequestHeader("Content-type", "application/json");
            ajaxDodajPredmet.send(JSON.stringify(novi));
        } else {
            var ajaxDodajGrupu = new XMLHttpRequest();
            let noviPredmet=predmeti.filter(p=>p.naziv==predmet)[0];
            let gr = grupePredmeti.filter(gp=>gp.predmet.naziv==predmet && gp.naziv==grupa);
            if (gr.length==0) {
                    let nova ={
                        naziv: grupa,
                        predmetId: noviPredmet.id
                    };
                    ajaxDodajGrupu.onreadystatechange = function() {   
                        if (ajaxDodajGrupu.readyState == 4 && ajaxDodajGrupu.status == 200) {
                            let novaGrupa = JSON.parse(ajaxDodajGrupu.responseText);
                            grupePredmeti.push(novaGrupa);
                            dodajNovuOpciju(predmet+"-"+grupa);
                            dodajAktivnost(grupa,predmet,true,true);
                        } 
                    } 
                    ajaxDodajGrupu.open("POST", "http://localhost:3000/grupa", true);
                    ajaxDodajGrupu.setRequestHeader("Content-type", "application/json");
                    ajaxDodajGrupu.send(JSON.stringify(nova));
            } else {
                dodajAktivnost(grupa,predmet,true,false);
            }
        }
    }
}
function dodajAktivnost (grupa,predmet,postoji,dodanaGrupa) {  
    var pocetak=document.getElementById('pocetak').value;
    var satiPocetak = parseInt(pocetak.split(":")[0]);
    var minutePocetak = parseInt(pocetak.split(":")[1]);
    var kraj=document.getElementById('kraj').value;
    var satiKraj = parseInt(kraj.split(":")[0]);
    var minuteKraj = parseInt(kraj.split(":")[1]);
    let grupaPredmet=grupePredmeti.filter(gp=>gp.naziv==grupa && gp.predmet.naziv==predmet)[0];
    let nova = {
        naziv: predmet+" "+document.getElementById("tipovi").value,
        tipId: nadjiIdTipa(document.getElementById('tipovi').value),
        pocetak: satiPocetak+minutePocetak/60,
        kraj: satiKraj+minuteKraj/60,
        danId: nadjiIdDana(document.getElementById('dani').value),
        grupaId: grupaPredmet.id,
        predmetId: grupaPredmet['predmet']['id']
    };
    if (validirajAktivnost(nova)) { 
        //ako vec postoji predmet ili ako predmet ne postoji i uspjesno je dodan
        //if (postoji || (!postoji && dodanPredmet)) {            
        let novaJSON=JSON.stringify(nova);       
        var ajaxDodajAktivnost = new XMLHttpRequest();
        ajaxDodajAktivnost.onreadystatechange = function () {
            if (ajaxDodajAktivnost.readyState == 4 && ajaxDodajAktivnost.status == 200) {
                let odgovor=JSON.parse(ajaxDodajAktivnost.responseText);
                if (odgovor.message==="Uspješno dodana aktivnost!") {
                    div.innerHTML="Uspješno dodana aktivnost!";
                    aktivnosti.push(nova);
                } else {
                    div.innerHTML="Aktivnost nije dodana!";
                    if (!postoji) {
                        obrisiGrupu(grupaPredmet.id);
                        obrisiPredmet(grupaPredmet['predmet']['id']);
                        izbrisiOpciju();
                    } else {
                        if (dodanaGrupa) {
                            obrisiGrupu(grupaPredmet.id);
                            izbrisiOpciju();

                        }
                    }
                }
            }
        }
        ajaxDodajAktivnost.open("POST", "http://localhost:3000/v2/aktivnost", true);
        ajaxDodajAktivnost.setRequestHeader("Content-type", "application/json");
        ajaxDodajAktivnost.send(novaJSON);
    } else {
           div.innerHTML="Aktivnost nije validna!";
           if (!postoji) {
                obrisiGrupu(grupaPredmet.id);
                obrisiPredmet(grupaPredmet['predmet']['id']);
                izbrisiOpciju();
            } else {
                if (dodanaGrupa) {
                    obrisiGrupu(grupaPredmet.id);
                    izbrisiOpciju();
                }
            }
    }
    document.getElementById("forma").reset();
}
