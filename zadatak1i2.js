
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const baza = require('./baza.js');
const { student, tip, studentGrupa, dan, grupa } = require('./baza.js');



baza.sequelize.sync({force:true}).then(function(){
    console.log("Gotovo kreiranje tabela!");
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/spirala2rasporedi.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/spirala2rasporedi.html'));
});


 


//zadatak 2.
app.get('/v1/predmeti', function (req, res){
    var predmeti=[];
    fs.readFile('predmeti.txt', 'utf8', function (err,podaci) {
        if (err) {
            throw err;
        }
        if (podaci != "") {
            redovi = podaci.toString().split("\r\n");
            for(let i = 0; i< redovi.length; i++) {
                var predmet= {
                    naziv: redovi[i]
                };
                predmeti.push(predmet);
            }
        }
        res.setHeader("Content-Type", "application/json");
        res.json(predmeti);
    })
}); 

app.get('/v1/aktivnosti', function(req, res) {
    var aktivnosti=[];
    fs.readFile('aktivnosti.txt', 'utf8', function (err,podaci) {
        if (err) {
            throw err;
        }
        if (podaci != "") {
            redovi = podaci.toString().split("\r\n");
            for(let i = 0; i< redovi.length; i++) {
                aktivnost= redovi[i].split(",");
                var nova= {
                    naziv: aktivnost[0],
                    tip: aktivnost[1],
                    pocetak: Number(aktivnost[2]),
                    kraj: Number(aktivnost[3]),
                    dan: aktivnost[4],
                };
                aktivnosti.push(nova);
            }
        }
        res.setHeader("Content-Type", "application/json");
        res.json(aktivnosti);
    })
});

app.get('/v1/predmet/:naziv/aktivnost/', function(req, res) {
    var naziv = req.params.naziv;
    fs.readFile('aktivnosti.txt', 'utf8', function (err,podaci) {
        if (err) {
            throw err;
        }
        var aktivnosti=[];
        if (podaci != "") {
            redovi = podaci.toString().split("\r\n");
            for(let i = 0; i< redovi.length; i++) {
                aktivnost= redovi[i].split(",");
                if (aktivnost[0].toLowerCase()==naziv.toLowerCase()) {
                    var nova= {
                        naziv: aktivnost[0],
                        tip: aktivnost[1],
                        pocetak: Number(aktivnost[2]),
                        kraj: Number(aktivnost[3]),
                        dan: aktivnost[4],
                    };
                    aktivnosti.push(nova);
                }
            }
        }
        res.setHeader("Content-Type", "application/json");
        res.send(aktivnosti);
    });
});

app.use(bodyParser.json());
app.post('/v1/predmet', function(req, res) {
    let tijelo = req.body;
    let predmet = tijelo['naziv'];
    if (predmet!="") {
        fs.readFile('predmeti.txt', 'utf8', function (err,podaci) {
            if (err) {
                throw err;
            }
            var postoji=false;
            if (podaci != "") {
                    redovi = podaci.toString().split("\r\n");
                    for(let i = 0; i< redovi.length; i++) {
                        if (redovi[i].toLowerCase()==predmet.toLowerCase()) {
                                postoji=true;
                                break;
                        }
                    }
            }
            var poruka="";
            if (postoji) 
                poruka = {
                    message: "Naziv predmeta postoji!"
                };
            else {
                var novi="";
                if ( podaci != 0)
                    novi=novi + "\r\n";
                novi=novi+predmet;
                fs.appendFile('predmeti.txt', novi, function (err) {
                    if (err) throw err;
                });
                poruka = {
                    message: "Uspješno dodan predmet!"
                }
            }
            res.setHeader("Content-Type", "application/json");
            res.json(poruka);
        });
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Predmet nije validan!"});
    }
});

function provjeriVrijeme (vrijeme) {
    if (Number.isInteger(vrijeme) ||  (vrijeme - Math.floor(vrijeme))==0.5)
        return true;
    return false;
}

app.post('/v1/aktivnost', function(req, res) {
    let tijelo = req.body;
    var validna=true;
    res.setHeader("Content-Type", "application/json");
    if (tijelo['pocetak']!="" && tijelo['kraj']!="" && tijelo['naziv']!="" && tijelo['tip']!="" && tijelo['dan']!="") {
    //da li je vrijeme odrzavanja aktivnosti unutar opsega od 8 do 21
        if ( !provjeriVrijeme(tijelo['pocetak']) || !provjeriVrijeme(tijelo['kraj']) || tijelo['pocetak']>=tijelo['kraj'] || tijelo['pocetak']<8 || tijelo['pocetak']>=21 || tijelo['kraj']<=8 || tijelo['kraj']>21) 
            validna=false;

        //da li je dan ponedjeljak, utorak, srijeda, cetvrtak, petak, subota, nedjelja
        if (validna) {
            dani=["ponedjeljak", "utorak", "srijeda", "četvrtak", "cetvrtak", "petak", "subota", "nedjelja"];
            for (var i=0; i<dani.length; i++) {
                if (tijelo['dan'].toLowerCase()==dani[i]) {
                    validna=true;
                    break;
                }
            }
        }
        fs.readFile('aktivnosti.txt', 'utf8', function (err,podaci) {
            if (err) {
                throw err;
            }
        if (validna && podaci != "") {
            //preklapanje aktivnosti
                    redovi = podaci.toString().split("\r\n");
                    for(let i = 0; i< redovi.length; i++) {
                            aktivnost= redovi[i].split(",");
                            var pocetak=aktivnost[2];
                            var kraj=aktivnost[3];
                            var dan=aktivnost[4];
                            if (dan.toLowerCase()==tijelo['dan'].toLowerCase()) {
                                if ((tijelo['pocetak']>pocetak && tijelo['pocetak']<kraj) || (tijelo['kraj']>pocetak && tijelo['kraj']<kraj) 
                                        || (tijelo['pocetak']<pocetak && tijelo['kraj']>kraj) ||  (tijelo['pocetak']>pocetak && tijelo['kraj']<kraj)
                                        || tijelo['pocetak']==pocetak || tijelo['kraj']==kraj) {
                                            validna=false;
                                            break;
                                }
                            }
                    }
            }
            if (!validna) 
                res.json({message: "Aktivnost nije validna!"});
            else {
                var nova="";
                if (podaci !=0 )
                    nova=nova+"\r\n";
                nova=nova+tijelo['naziv']+","+tijelo['tip']+","+tijelo['pocetak']+","+tijelo['kraj']+","+tijelo['dan'];
                fs.appendFile('aktivnosti.txt', nova, function (err) {
                    if (err) throw err;
                });
                res.json({message:"Uspješno dodana aktivnost!"});
            }
        });
    } else {
        res.json({message: "Aktivnost nije validna!"});
    }
});

app.delete('/v1/aktivnost/:naziv', function(req, res) { 
    var naziv = req.params.naziv;
    fs.readFile('aktivnosti.txt', 'utf8', function (err,podaci) {
        if (err) {
            throw err;
        }
        indeksi=[];
        if (podaci != "") {
        redovi = podaci.toString().split("\r\n");
        for(let i = 0; i< redovi.length; i++) {
            aktivnost= redovi[i].split(",");
            if (aktivnost[0].toLowerCase()==naziv.toLowerCase()) {
                indeksi.push(i);
            }
        }
    }
        if (indeksi.length!=0) {
            //izbacivanje redova
            for (let i=indeksi.length-1; i>=0; i--) {
                redovi.splice(indeksi[i], 1);
            }
            const noviPodaci = redovi.join('\n');
            fs.writeFile('aktivnosti.txt', noviPodaci, (err) => {
                if (err) throw err;
                res.json({message:"Uspješno obrisana aktivnost!"});
            });
        } else {
            res.json({message:"Greška - aktivnost nije obrisana!"});
        }
    });
});

app.delete('/v1/predmet/:naziv', function(req, res) { 
    var naziv = req.params.naziv;
    fs.readFile('predmeti.txt', 'utf8', function (err,podaci) {
        if (err) {
            throw err;
        }
        var indeks=-1;
        if (podaci != "") {
        redovi = podaci.toString().split("\r\n");
        for(let i = 0; i< redovi.length; i++) {
            if (redovi[i].toLowerCase()==naziv.toLowerCase()) {
                indeks=i;
                break;
            }
        }
    }
        if (indeks!=-1) {
            redovi.splice(indeks, 1);
            const noviPodaci = redovi.join('\r\n');
            fs.writeFile('predmeti.txt', noviPodaci, (err) => {
                if (err) throw err;
                    res.json({message:"Uspješno obrisan predmet!"});
                });
        } else {
            res.json({message:"Greška - predmet nije obrisan!"});
        }
    });
});

app.delete('/v1/all', function(req, res) { 
    var greska=false;
    fs.writeFile('predmeti.txt', '', function (err) {
        if (err) greska=true;
      });
      if (!greska) {
        fs.writeFile('aktivnosti.txt', '', function (err) {
            if (err) greska=true;
        });
      }
      if (greska)
        res.json( {message:"Greška - sadržaj datoteka nije moguće obrisati!"});
      else
        res.json( {message:"Uspješno obrisan sadržaj datoteka!"});
});

//spirala 4.
app.get('/v2/predmeti', function (req, res){
    baza.predmet.findAll({attributes: ['id','naziv']}).then(function(podaci){
        let predmeti =[];
        if (podaci!=null) predmeti=podaci;
        res.setHeader("Content-Type", "application/json");
        res.json(predmeti)});        	
});

app.get('/v2/studenti', function(req, res) {
    baza.student.findAll({attributes: ['id', 'ime','index']}).then(function(podaci){
        let studenti =[];
        if (podaci!=null) studenti=podaci;
        res.setHeader("Content-Type", "application/json");
        res.json(studenti)});   
});

app.get('/v2/dani', function(req, res) {
    baza.dan.findAll({attributes: ['id', 'naziv']}).then(function(podaci){
        let dani =[];
        if (podaci!=null) dani=podaci;
        res.setHeader("Content-Type", "application/json");
        res.json(dani)});   
});

app.get('/v2/tipovi', function(req, res) {
    baza.tip.findAll({attributes: ['id', 'naziv']}).then(function(podaci){
        let tipovi =[];
        if (podaci!=null) tipovi=podaci;
        res.setHeader("Content-Type", "application/json");
        res.json(tipovi)});   
});

app.get('/v2/grupe', function(req, res) {
    baza.grupa.findAll({attributes: ['id', 'naziv','predmetId']}).then(function(podaci){
        let grupe =[];
        if (podaci!=null) grupe=podaci;
        res.setHeader("Content-Type", "application/json");
        res.json(grupe)});   
});

app.get('/v2/aktivnosti', function(req, res) {
    baza.aktivnost.findAll({attributes: ['id', 'naziv','pocetak', 'kraj','grupaId','danId','tipId','predmetId']}).then(function(podaci){
        let aktivnosti =[];
        if (podaci!=null) aktivnosti=podaci;
        res.setHeader("Content-Type", "application/json");
        res.json(aktivnosti)});   
});

app.get('/v2/tip/:id', function(req, res) {
    let idTipa=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.tip.findOne({where: {id: idTipa}, attributes: ['id', 'naziv']}).then(function(tip){
        if (tip!=null)
            res.json(tip);
        else {
            res.json({message:"Nema tipa sa zadanim id"});
        }   
    });
});

app.get('/v2/dan/:id', function(req, res) {
    let idDana=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.dan.findOne({where: {id: idDana}, attributes: ['id', 'naziv']}).then(function(dan){
        if (dan!=null)
            res.json(dan);
        else {
            res.json({message:"Nema dana sa zadanim id"});
        }   
    });
});


app.get('/v2/student/:index', function(req, res) {
    let indexStudenta=req.params.index;
    res.setHeader("Content-Type", "application/json");
    baza.student.findOne({where: {index: indexStudenta}, attributes: ['id', 'ime','index']}).then(function(student){
        if (student!=null)
            res.json(student);
        else {
            res.json({message:"Nema studenta sa zadanim indeksom!"});
        }   
    });
});

app.get('/v2/aktivnost/:id', function(req, res) {
    let idAktivnosti=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.aktivnost.findOne({where: {id: idAktivnosti}, attributes: ['id', 'naziv','pocetak','kraj','grupaId','predmetId','danId','tipId']}).then(function(aktivnost){
        if (aktivnost!=null)
            res.json(aktivnost);
        else {
            res.json({message:"Nema aktivnosti sa zadanim id!"});
        }   
    });
});

app.get('/v2/predmet/:id', function(req, res) {
    let idPredmeta=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.predmet.findOne({where: {id: idPredmeta}, attributes: ['id', 'naziv']}).then(function(predmet){
        if (predmet!=null)
            res.json(predmet);
        else {
            res.json({message:"Nema predmeta sa zadanim id!"});
        }   
    });
});

app.get('/v2/grupa/:id', function(req, res) {
    let idGrupa=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.grupa.findOne({where: {id: idGrupa}, attributes: ['id', 'naziv']}).then(function(grupa){
        if (grupa!=null)
            res.json(grupa);
        else {
            res.json({message:"Nema grupe sa zadanim id!"});
        }   
    });
});


app.post('/v2/predmet', function(req, res) {
    let tijelo = req.body;
    let predmet = tijelo['naziv'];
    if (predmet!=""){
        baza.predmet.findAll({where: {naziv: predmet}}).then(function(predmeti){
            if (predmeti.length==0) {
                baza.predmet.create({naziv:predmet}).then(function(predmet){
                    res.setHeader("Content-Type", "application/json");
                    res.json({message: "Uspješno dodan predmet!"});
                });
            } else {
                res.setHeader("Content-Type", "application/json");
                res.json({message: "U bazi postoji predmet sa istim imenom!"});
            }
        })
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Nevalidan naziv predmeta!"});
    }
});
 
app.post('/v2/student', function(req, res) {
    let tijelo = req.body;
    if (tijelo['ime']!="" && tijelo['index']!="") {
        baza.student.findAll({where: {index: tijelo['index']}}).then(function(studenti){
            if (studenti.length==0) {
                baza.student.create({ime:tijelo['ime'], index:tijelo['index']}).then(function(){
                    res.setHeader("Content-Type", "application/json");
                    res.json({message: "Uspješno dodan student!"});
                });
            } else {
                res.setHeader("Content-Type", "application/json");
                res.json({message: "U bazi postoji student sa istim indexom!"});
            }
        });
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Nevalidni podaci!"});
    }
});

app.post('/v2/dan', function(req, res) {
    let tijelo = req.body;
    if (tijelo['naziv']!="") {
        baza.dan.findAll({where: {naziv: tijelo['naziv']}}).then(function(dani){
            if (dani.length==0) {
                baza.dan.create({naziv:tijelo['naziv']}).then(function(){
                    res.setHeader("Content-Type", "application/json");
                    res.json({message: "Uspješno dodan dan!"});
                });
            } else {
                res.setHeader("Content-Type", "application/json");
                res.json({message: "U bazi postoji dan sa istim nazivom!"})
            }
        }); 
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Nevalidni podaci!"});
    }
});

app.post('/v2/tip', function(req, res) {
    let tijelo = req.body;
    if (tijelo['naziv']!="") {
        baza.tip.findAll({where: {naziv: tijelo['naziv']}}).then(function(tipovi) {
            if (tipovi.length==0) {
                baza.tip.create({naziv:tijelo['naziv']}).then(function(){
                    res.setHeader("Content-Type", "application/json");
                    res.json({message: "Uspješno dodan tip!"});
                });
            } else {
                res.setHeader("Content-Type", "application/json");
                res.json({message: "U bazi postoji tip sa istim nazivom!"});
            }
        });
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Nevalidni podaci!"});
    }
});

app.post('/v2/grupa', function(req, res){
    let tijelo = req.body;
    if (tijelo['naziv']!="" && tijelo['predmetId']!="") {
        baza.predmet.findAll({where: {id: tijelo['predmetId']}}).then(function(predmeti){
            if (predmeti.length!=0) {
                baza.grupa.findAll({where: {naziv: tijelo['naziv'], predmetId:tijelo['predmetId']}}).then(function(grupe) {
                    if (grupe.length==0) {
                        baza.grupa.create({naziv:tijelo['naziv'], predmetId: tijelo['predmetId']}).then(function(){
                            res.setHeader("Content-Type", "application/json");
                            res.json({message: "Uspješno dodana grupa!"});
                        });
                    } else {
                        res.setHeader("Content-Type", "application/json");
                        res.json({message: "U bazi postoji grupa sa istim nazivom i istim predmetom!"});
                    }
                });
            } else {
                res.setHeader("Content-Type", "application/json");
                res.json({message: "U bazi ne postoji predmet sa zadanim predmetId!"});
            }
        });
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Nevalidni podaci!"});
    }
});

function validirajAktivnost (aktivnosti, nova) {
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

app.post('/v2/aktivnost', function(req, res) {
    let tijelo = req.body;
    if (tijelo['naziv']!="" && tijelo['pocetak']!="" && tijelo['kraj']!="" && tijelo['predmetId']!="" && tijelo['danId']!="" && tijelo['grupaId']!="" && tijelo['tipId']!="") {
        baza.dan.findAll({where:{id: tijelo['danId']}}).then(function(dani){
            if (dani.length!=0) {
                baza.tip.findAll({where: {id:tijelo['tipId']}}).then(function(tipovi){
                    if (tipovi.length!=0) {
                        baza.grupa.findAll({where: {id: tijelo['grupaId'], predmetId: tijelo['predmetId']}}).then(function(grupe) {
                            if (grupe.length!=0) {
                                baza.aktivnost.findAll().then(function(aktivnosti){
                                    if (validirajAktivnost(aktivnosti, tijelo)) {
                                        baza.aktivnost.create({naziv:tijelo['naziv'], pocetak:tijelo['pocetak'], kraj:tijelo['kraj'], predmetId: tijelo['predmetId'], danId: tijelo['danId'], tipId: tijelo['tipId'], grupaId:tijelo['grupaId']}).then(function(){
                                            res.setHeader("Content-Type", "application/json");
                                            res.json({message: "Uspješno dodana aktivnost!"});
                                        });
                                    } else {
                                        res.json({message: "Aktivnost nije validna!"});
                                    }
                                });
                            } else {
                                res.json({message: "U bazi ne postoji grupa i predmet sa zadanim grupaId i predmetId!"});         
                            }
                        });
                    } else {
                        res.json({message: "U bazi ne postoji tip sa zadanim tipId!"});        
                    }
                });
            } else {
                res.json({message: "U bazi ne postoji dan sa zadanim danId!"});
            }
        });       
    } else {
        res.setHeader("Content-Type", "application/json");
        res.json({message: "Nevalidni podaci!"});
    }
});


app.delete('/v2/predmet/:id', function(req, res) {
    var id=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.predmet.findOne({where:{id:id}}).then(function(p){
        if (p!=null) {
            p.destroy().then(function() {
                res.json({message: "Uspješno obrisan predmet!"});
            });
        } else {
            res.json({message: "Ne postoji predmet sa zadanim id!"});
        }
    });
});

app.delete('/v2/student/:id', function(req, res) {
    var id=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.student.findOne({where:{id:id}}).then(function(s){
        if (s!=null) {
            s.destroy().then(function() {
                res.json({message: "Uspješno obrisan student!"});
            });
        } else {
            res.json({message: "Ne postoji student sa zadanim id!"});
        }
    });
});

app.delete('/v2/aktivnost/:id', function(req, res) {
    var id=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.aktivnost.findOne({where:{id:id}}).then(function(a){
        if (a!=null) {
            a.destroy().then(function() {
                res.json({message: "Uspješno obrisana aktivnost!"});
            });
        } else {
            res.json({message: "Ne postoji aktivnost sa zadanim id!"});
        }
    });
});

app.delete('/v2/tip/:id', function(req, res) {
    var id=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.tip.findOne({where:{id:id}}).then(function(t){
        if (t!=null) {
            t.destroy().then(function() {
                res.json({message: "Uspješno obrisan tip!"});
            });
        } else {
            res.json({message: "Ne postoji tip sa zadanim id!"});
        }
    });
});

app.delete('/v2/dan/:id', function(req, res) {
    var id=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.dan.findOne({where:{id:id}}).then(function(d){
        if (d!=null) {
            d.destroy().then(function() {
                res.json({message: "Uspješno obrisan dan!"});
            });
        } else {
            res.json({message: "Ne postoji dan sa zadanim id!"});
        }
    });
});

app.delete('/v2/grupa/:id', function(req, res) {
    var id=req.params.id;
    res.setHeader("Content-Type", "application/json");
    baza.grupa.findOne({where:{id:id}}).then(function(g){
        if (g!=null) {
            g.destroy().then(function() {
                res.json({message: "Uspješno obrisana grupa!"});
            });
        } else {
            res.json({message: "Ne postoji grupa sa zadanim id!"});
        }
    });
});

app.put('/v2/predmet/:id', function (req, res) {
    let idPredmet=req.params.id;
    let tijelo=req.body;
    res.setHeader("Content-Type", "application/json");
    baza.predmet.findOne({where:{id:idPredmet}}).then(function(p){
        if (p!=null) {
            p['naziv']=tijelo['naziv'];
            baza.predmet.findAll({where: {naziv: tijelo['naziv']}}).then(function(istiNaziv){
                if (istiNaziv.length==0) {
                    p.save().then(function() {
                        res.json({message: "Uspješno izmijenjen predmet!"});
                    });
                } else {
                    res.json({message:"U bazi već postoji predmet sa zadanim nazivom!"});
                }
            });
        }
        else {
            res.json({message:"Ne postoji predmet sa zadanim id u bazi!"});
        }
    });
}); 

app.put('/v2/student/:id', function (req, res) {
    let idStudenta=req.params.index;
    let tijelo=req.body;
    res.setHeader("Content-Type", "application/json");
    baza.student.findOne({where:{id:idStudenta}}).then(function(s){
        if (s!=null) {
            s['ime']=tijelo['ime'];
            s['index']=tijelo['index'];
            baza.student.findAll({where: {index: tijelo['index']}}).then(function(istiIndex){
                if (istiIndex.length==0) {
                    s.save().then(function() {
                        res.json({message: "Uspješno izmijenjen student!"});
                    });
                } else {
                    res.json({message: "U bazi postoji student sa istim indeksom!"});
                }
            })        
        }
        else {
            res.json({message:"Ne postoji student sa zadanim indeksom u bazi!"});
        }
    });
}); 

app.put('/v2/grupa/:id', function (req, res) {
    let idGrupe=req.params.id;
    let tijelo=req.body;
    res.setHeader("Content-Type", "application/json");
    baza.grupa.findOne({where:{id:idGrupe}}).then(function(g){
        if (g!=null) {
            baza.predmet.findOne({where: {id:tijelo['predmetId']}}).then(function(predmet){
                if (predmet!=null) {
                    g['naziv']=tijelo['naziv'];
                    g['predmetId']=tijelo['predmetId'];
                    baza.grupa.findAll({where: {naziv: tijelo['naziv'], predmetId: tijelo['predmetId']}}).then(function(isteGrupe){
                        if (isteGrupe.length==0) {
                            g.save().then(function() {
                                res.json({message: "Uspješno izmijenjena grupa!"});
                            });
                        } else {
                            res.json({message: "U bazi već postoji grupa sa istim nazivom za isti predmet!"});
                        }
                    });
                } else {
                    res.json({message:"Ne postoji predmet sa zadanim id u bazi!"});
                }
            });        
        }
        else {
            res.json({message:"Ne postoji grupa sa zadanim id u bazi!"});
        }
    });
}); 


app.put('/v2/dan/:id', function (req, res) {
    let idDana=req.params.id;
    let tijelo=req.body;
    res.setHeader("Content-Type", "application/json");
    baza.dan.findOne({where:{id:idDana}}).then(function(d){
        if (d!=null) {
            d['naziv']=tijelo['naziv'];
            baza.dan.findAll({where:{naziv: tijelo['naziv']}}).then(function(istiNaziv){
                if (istiNaziv.length==0) {
                    d.save().then(function() {
                        res.json({message: "Uspješno izmijenjen dan!"});
                    });
                } else {
                    res.json({message:"U bazi već postoji dan sa zadanim imenom!"})
                }
            });
        }
        else {
            res.json({message:"Ne postoji dan sa zadanim id u bazi!"});
        }
    });
}); 

app.put('/v2/tip/:id', function (req, res) {
    let idTipa=req.params.id;
    let tijelo=req.body;
    res.setHeader("Content-Type", "application/json");
    baza.tip.findOne({where:{id:idTipa}}).then(function(t){
        if (t!=null) {
            t['naziv']=tijelo['naziv'];
            baza.tip.findAll({where: {naziv:tijelo['naziv']}}).then(function(istiNaziv){
                if (istiNaziv.length==0) {
                    t.save().then(function() {
                    res.json({message: "Uspješno izmijenjen tip!"});
                    });
                } else {
                    res.json({message: "U bazi već postoji tip sa istim imenom!"});
                }
            });
        }
        else {
            res.json({message:"Ne postoji tip sa zadanim id u bazi!"});
        }
    });
}); 

app.put('/v2/aktivnost/:id', function (req, res) {
    let idAktivnost=req.params.id;
    let tijelo=req.body;
    res.setHeader("Content-Type", "application/json");
    baza.aktivnost.findOne({where:{id:idAktivnost}}).then(function(a){
        if (a!=null) {
            baza.grupa.findOne({where: {id:tijelo['grupaId']}}).then(function(grupa){
                if (grupa!=null) {
                    baza.dan.findOne({where: {id:tijelo['danId']}}).then(function(dan){
                        if (dan!=null) {
                            baza.tip.findOne({where: {id:tijelo['tipId']}}).then(function(tip){
                                if (tip!=null) {
                                    a['naziv']=tijelo['naziv'];
                                    a['predmetId']=tijelo['predmetId'];
                                    a['grupaId']=tijelo['grupaId'];
                                    a['tipId']=tijelo['tipId'];
                                    a['danId']=tijelo['danId'];
                                    a['pocetak']=tijelo['pocetak'];
                                    a['kraj']=tijelo['kraj'];
                                    baza.aktivnost.findAll().then(function(aktivnosti){
                                        aktivnosti=aktivnosti.filter(akt=>akt.id!=a.id);
                                        if (validirajAktivnost(aktivnosti, a)) {
                                            a.save().then(function() {
                                                res.json({message: "Uspješno izmijenjena aktivnost!"});
                                            });
                                        } else {
                                            res.json({message:"Aktivnost nije validna!"});
                                        }
                                    })
                                } else {
                                    res.json({message:"Ne postoji tip sa zadanim id"});
                                }
                            });
                        } else {
                            res.json({message:"Ne postoji dan sa zadanim id u bazi!"});
                        }
                    });
                } else {
                    res.json({message:"Ne postoji grupa sa zadanim id i predmetId u bazi!"});
                }
            });        
        }
        else {
            res.json({message:"Ne postoji aktivnost sa zadanim id u bazi!"});
        }
    });
});

app.use(bodyParser.json());
app.post('/studenti', function(req, res) {
    let nizStudenata = req.body;
    var odgovor=[];
    //nasla grupu u kojoj se studenti dodaju
    baza.grupa.findOne({where:{naziv:nizStudenata[0]['grupa']}}).then(function(grupa){
        if (grupa==null)
            res.status(404).send("Nije kreirana grupa!");
        else {
            //procitala sve studenete upisane u bazu
            baza.student.findAll({attributes:['id','ime','index']}).then(function(studenti) {
                for (let i = 0; i <nizStudenata.length; i++) {
                    const rezultat = studenti.filter(student => student.index == nizStudenata[i].index);
                    if (rezultat.length==0) {
                        //ako nema studenata sa istim indeksom kreiramo studenta i dodijelimo mu grupu
                        baza.student.create({ime: nizStudenata[i].ime, index: nizStudenata[i].index}).then(function(student){
                            return student.setGrupe([grupa]).then(function(){
                                return new Promise(function(resolve,reject){resolve(student);});
                            });                        
                        });
                    } else {
                        rezultat.forEach(student => {
                            if (student.ime!=nizStudenata[i].ime)
                            odgovor.push({message: "Student "+nizStudenata[i].ime+" nije kreiran jer postoji student "+student.ime+" sa istim indexom "+student['index']+"."}); 
                            else {                       
                                //treba pronaci predmet od grupe u koju se studenti dodaju
                                grupa.getPredmet().then(function(predmet){
                                    //za studenta nađemo sve grupe za taj predmet
                                    student.getGrupe({where :{predmetId:predmet.id}}).then(function(grupe){
                                        //sada provjerimo je li student vec dodan u grupu za predmet
                                        if (grupe.length==0) {
                                            return student.addGrupe(grupa).then(function(){
                                                return new Promise(function(resolve,reject){resolve();});
                                            }); 
                                        } else {
                                            student.removeGrupe(grupe[0]).then(function(red) {
                                                student.addGrupe(grupa).then(function() {
                                                    return new Promise(function(resolve,reject){resolve();});
                                                })
                                            });
                                        }
                                    });
                                }) 
                            }               
                        });
                    }
                }
                res.status(200).send(JSON.stringify(odgovor));
            });
        }
    });
});

app.get('/grupa/:naziv', function (req, res) {
    baza.grupa.findOne({where: {naziv:req.params.naziv}}).then(function(grupa){
        res.send({broj:grupa['id']});
    })
});

app.get('/grupaPredmet', function (req, res) {
    baza.grupa.findAll({
        attributes: ['id','naziv'],
        include: [{
            attributes: ['id','naziv'],
            model: baza.predmet,
            required: false,
            right: true 
        }]
    }).then(function(grupe){
        res.send(grupe);
    });
});

app.post('/predmet', function(req, res) {
    let tijelo = req.body;
    let predmet = tijelo['naziv'];
    baza.predmet.create({naziv:predmet}).then(function(predmet){
        res.setHeader("Content-Type", "application/json");
        let novi= {
            id:predmet.id,
            naziv:predmet.naziv
        }
        res.send(novi);
    });
});
app.post('/grupa', function(req, res) {
    let tijelo = req.body;
    baza.grupa.create({naziv:tijelo['naziv'], predmetId:tijelo['predmetId']}).then(function(grupa){
        baza.predmet.findOne({where:{id: grupa.predmetId}}).then(function(predmet) {
        res.setHeader("Content-Type", "application/json");
        let novi= {
            id:grupa.id,
            naziv:grupa.naziv,
            predmet: predmet
        }
        res.send(novi);
    });
});
});
var server = app.listen(3000, function () {
    var port = server.address().port;
});

module.exports = server;