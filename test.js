var assert = chai.assert;
var expect = chai.expect;
var alert;


describe('Raspored', function() {

 describe('iscrtajRaspored', function() {
      afterEach(function() {
        let stara=document.getElementById('div1').getElementsByTagName("table")[0];
        if (stara!=null)
            document.getElementById('div1').removeChild(stara);
        //ponistavamo u slucaju da neki od prethodnih testova upise "Greska"
        document.getElementById('div1').innerHTML="";
      });

   it('ako niz dani ima 5 elemenata, tabela treba imati 6 redova', function() {
        Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
        let tabela=document.getElementById('div1').getElementsByTagName("table")[0];
        let redovi=tabela.getElementsByTagName("tr");
        assert.equal(redovi.length, 6, "Broj redova treba biti 6");
    });
    it('ako je vrijeme pocetka 8:00, a kraja 21 tabela u svakom redu za dane treba imati 27 kolona', function() {
        Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
        let tabela=document.getElementById('div1').getElementsByTagName("table")[0];
        for ( let i = 1; i < tabela.childElementCount; i++) {
          assert.equal(tabela.rows[i].childElementCount, 27, "Broj kolona treba biti 27");
        }
      });
    it('ako je vrijeme pocetka 09:00, prvi sati koji se prikazuje je 10:00', function() {
        Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
        let tabela=document.getElementById('div1').getElementsByTagName("table")[0];
        let prviSat;
        for ( let i = 0; i < tabela.childNodes[0].childElementCount; i++) {
          if (tabela.childNodes[0].childNodes[i].innerHTML!="") {
            prviSat=tabela.childNodes[0].childNodes[i].innerHTML;
            break;
          }
        }
        assert.equal(prviSat, "10:00", "Prvi sat treba biti 10:00");
      });
     it('posljednji sat se ne upisuje u prvom redu tabele', function() {
        Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
        var tabela = document.getElementById('div1').getElementsByTagName("table")[0];
        var prviRed=tabela.childNodes[0];
        var tekst;
        for ( var i = prviRed.childElementCount-1; i >= 0; i--) {
          if (prviRed.childNodes[i].innerHTML!="") {
              tekst=prviRed.childNodes[i].innerHTML;
              break;
          }
        }
        assert.equal(tekst, "19:00", "Posljednji sat treba biti 19:00");
      });
      it('svi elementi iz niza dani trebaju biti upisani u tabelu i to onim redoslijedom kako je navedeno u nizu', function() {
          Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
          var tabela = document.getElementById('div1').getElementsByTagName("table")[0];
          assert.equal("Ponedjeljak", tabela.childNodes[1].childNodes[0].innerHTML, "Prvi dan je ponedjeljak");
          assert.equal("Utorak", tabela.childNodes[2].childNodes[0].innerHTML, "Drugi dan je utorak");
          assert.equal("Srijeda", tabela.childNodes[3].childNodes[0].innerHTML, "Treći dan je srijeda");
          assert.equal("Četvrtak", tabela.childNodes[4].childNodes[0].innerHTML, "Četvrti dan je četvrtak");
          assert.equal("Petak", tabela.childNodes[5].childNodes[0].innerHTML, "Peti dan je petak");
      });
      it('ako je vrijeme pocetka vece od vremena kraja u div treba upisati "Greška"', function() {
          Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 10,9);
          assert.equal(document.getElementById('div1').innerHTML, "Greška", "U divu treba pisati Greska");
      });
      it('ako je vrijeme pocetka jednako vremenu kraja u div treba upisati "Greška"', function() {
          Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 10,10);
          assert.equal(document.getElementById('div1').innerHTML, "Greška", "U divu treba pisati Greska");
      });
    it('ako je vrijeme pocetka decimalni broj, u div treba upisati "Greska"', function() {
          Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9.5,21);
          assert.equal(document.getElementById('div1').innerHTML, "Greška", "Vrijeme početka treba biti cijeli broj");
    });
    it('ako je vrijeme kraja decimalni broj, u div treba upisati "Greska"', function() {
          Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21.5);
          assert.equal(document.getElementById('div1').innerHTML, "Greška", "Vrijeme početka treba biti cijeli broj");
    });
    it('ako je vrijeme početka broj manji od 0 u div treba upisati "Greska"', function() {
        Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], -1,26);
        assert.equal(document.getElementById('div1').innerHTML, "Greška", "Vrijeme početka treba biti cijeli broj u rasponu od 0 do 24");
    });
    it('ako je vrijeme kraja broj veci od 24 u div treba upisati "Greska"', function() {
        Raspored.iscrtajRaspored(document.getElementById('div1'),['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,25);
        assert.equal(document.getElementById('div1').innerHTML, "Greška", "Vrijeme kraja treba biti cijeli broj u rasponu od 0 do 24");
    });

});


describe('dodajAktivnost', function() {
  beforeEach (function() {
    alert = sinon.spy();
  });
    afterEach(function() {
      let stara=document.getElementById('div1').getElementsByTagName("table")[0];
      if (stara!=null)
          document.getElementById('div1').removeChild(stara);
      document.getElementById('div1').innerHTML="";
    });

  it('raspored nije kreiran', function() {
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 11.3, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - raspored nije kreiran");      
  });
  it('treba se dodati aktivnost: predavanje iz RMA od 9 do 12', function() {
      Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
      Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 12, "Ponedjeljak");
      let tabela=document.getElementById('div1').getElementsByTagName("table")[0];
      let ponedjeljak=tabela.childNodes[1];
      let polje=ponedjeljak.childNodes[3];
      assert.isTrue(polje.classList.contains("popunjeni"), "Polje treba biti popunjeno")
      assert.isTrue(polje.colSpan==6);
  });
  it('treba se dodati aktivnost: predavanje iz RMA od 8 do 12', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 8, 12, "Ponedjeljak");
    let tabela=document.getElementById('div1').getElementsByTagName("table")[0];
    let ponedjeljak=tabela.childNodes[1];
    let polje=ponedjeljak.childNodes[1];
    assert.isTrue(polje.classList.contains("popunjeni"), "Polje treba biti popunjeno")
    assert.isTrue(polje.colSpan==8);
});
it('treba se dodati aktivnost: predavanje iz RMA od 19 do 21', function() {
  Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
  Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje",19, 21, "Ponedjeljak");
  let tabela=document.getElementById('div1').getElementsByTagName("table")[0];
  let ponedjeljak=tabela.childNodes[1];
  let polje=ponedjeljak.childNodes[23];
  assert.isTrue(polje.classList.contains("popunjeni"), "Polje treba biti popunjeno")
  assert.isTrue(polje.colSpan==4);
});

  it('preklapanje termina (isto vrijeme pocetka i kraja)', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 12, "Ponedjeljak");
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 12, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - već postoji termin u rasporedu u zadanom vremenu", "ne treba se dodati aktivnost u raspored");
  });
 it('preklapanje termina (isto vrijeme pocetka, novi termin traje krace', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 12, "Ponedjeljak");
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 10.5, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - već postoji termin u rasporedu u zadanom vremenu", "ne treba se dodati aktivnost u raspored");
  });
  it('preklapanje termina (pocetak novog termina dok traje druga aktivnost)', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 8,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 10, 13, "Ponedjeljak");
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 11, 12.5, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - već postoji termin u rasporedu u zadanom vremenu", "ne treba se dodati aktivnost u raspored");
  });
  it('dodaje se aktivnost cije je vrijeme pocetka manje od vremena pocetka rasporeda', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 8, 9.5, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "ne treba se dodati aktivnost u raspored");
  });
  it('dodaje se aktivnost cije je vrijeme kraja vece od vremena kraja rasporeda', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 20.5, 21.5, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "ne treba se dodati aktivnost u raspored");
  });
  it('dodaje se aktivnost cije vrijeme pocetka nije cijeli broj niti ima decimalni dio 5', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9.7, 11, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "ne treba se dodati aktivnost u raspored");
  });
  it('dodaje se aktivnost cije vrijeme kraja nije cijeli broj niti ima decimalni dio 5', function() {
    Raspored.iscrtajRaspored(document.getElementById('div1'), ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'], 9,21);
    Raspored.dodajAktivnost(document.getElementById('div1'), "RMA", "predavanje", 9, 11.3, "Ponedjeljak");
    expect(alert.args[0][0]).to.equal("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "ne treba se dodati aktivnost u raspored");
  });
});
});
