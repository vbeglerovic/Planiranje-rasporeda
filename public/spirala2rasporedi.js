let okvir1=document.getElementById('div1');
iscrtajRaspored(okvir1, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8,21);
dodajAktivnost(okvir1,"WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(okvir1,"WT","vježbe",12,13.5,"Ponedjeljak");
dodajAktivnost(okvir1,"RMA","predavanje",14,17,"Ponedjeljak");
dodajAktivnost(okvir1,"RMA","vježbe",12.5,14,"Utorak");
dodajAktivnost(okvir1,"DM","tutorijal",14,16,"Utorak");
dodajAktivnost(okvir1,"DM","predavanje",16,19,"Utorak");
dodajAktivnost(okvir1,"OI","predavanje",12,15,"Srijeda");
dodajAktivnost(okvir1, "RG", "vježbe", 19, 21, "Petak");
dodajAktivnost(okvir1, "TP", "predavanje", 19.5, 21, "Četvrtak");
dodajAktivnost(okvir1, "ASP", "predavanje", 8, 10.5, "Utorak");
dodajAktivnost(okvir1, "ASP", "vježbe", 13.5, 14.5, "Četvrtak");

let okvir2=document.getElementById('div2');
iscrtajRaspored(okvir2, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 9,20);
dodajAktivnost(okvir2,"WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(okvir2,"WT","vježbe",12.5,14,"Ponedjeljak");
dodajAktivnost(okvir2,"RMA","predavanje",18,20,"Ponedjeljak");
dodajAktivnost(okvir2,"RMA","vježbe",12.5,14,"Utorak");
dodajAktivnost(okvir2,"DM","tutorijal",14,16,"Utorak");
dodajAktivnost(okvir2,"DM","predavanje",16,19,"Utorak");
dodajAktivnost(okvir2,"OI","predavanje",12,15,"Srijeda");
dodajAktivnost(okvir2, "RG", "vježbe", 19, 20, "Petak");
dodajAktivnost(okvir2, "TP", "predavanje", 18.5, 20, "Četvrtak");
dodajAktivnost(okvir2, "ASP", "vježbe", 13.5, 14.5, "Četvrtak");
//termin zazuzet jer je od 9 do 12 WT predavanje
dodajAktivnost(okvir2, "IM1", "predavanja",9, 12, "Ponedjeljak");
//termin zauzet jer RMA predavanje traje od 14 do 17
dodajAktivnost(okvir2, "TP", "vježbe",13.5, 15, "Utorak");
//ne postoji u rasporedu termin 8.5
dodajAktivnost(okvir2, "ASP", "vježbe", 8.5, 10, "Petak");
//ne postoji u rasporedu termin 20.5
dodajAktivnost(okvir2, "LD", "vježbe", 19.5, 20.5, "Petak");
//vrijemeKraja manje od vremenaPocetka
dodajAktivnost(okvir2, "AFJ", "vježbe", 12.5,11.5, "Petak");


let okvir3=document.getElementById('div3');
iscrtajRaspored(okvir3, ["Utorak", "Srijeda", "Četvrtak", "Petak"], 13,20);
dodajAktivnost(okvir3,"WT","predavanje",13,14.5,"Utorak");
dodajAktivnost(okvir3,"WT","vježbe",18.5,20,"Srijeda");
dodajAktivnost(okvir3,"RMA","predavanje",15,17,"Srijeda");
dodajAktivnost(okvir3,"DM","tutorijal",14.5,16,"Utorak");
dodajAktivnost(okvir3, "RG", "vježbe", 18, 19.5, "Petak");
dodajAktivnost(okvir3, "TP", "predavanje", 18.5, 20, "Četvrtak");
//ne postoji u rasporedu termin 20.5
dodajAktivnost(okvir3, "LD", "vježbe", 19.5, 20.5);
//ne postoji u rasporedu termin 11-12
dodajAktivnost(okvir3, "AFJ", "vježbe", 11, 12, "Petak");
//termin zazuzet jer je od 13 do 14.5 WT predavanje
dodajAktivnost(okvir2, "IM1", "predavanja",14, 15, "Utorak");
//termin zauzet jer RG vjezba traju od 19.5 do 20.5
dodajAktivnost(okvir2, "TP", "vježbe",17.5, 20, "Petak");
//ne postoji u rasporedu termin 8.5
