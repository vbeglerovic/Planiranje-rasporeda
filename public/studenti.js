window.onload= function () {
    //ucitavanje grupa u niz
    var ajaxGrupe = new XMLHttpRequest();
    ajaxGrupe.onreadystatechange = function() {
    if (ajaxGrupe.readyState == 4 && ajaxGrupe.status == 200) {
        grupe=JSON.parse(ajaxGrupe.responseText);
        let lista= document.getElementById("grupe");
        for (let i=0; i<grupe.length; i++) {
            let opcija = document.createElement("option");
            opcija.text = grupe[i]['naziv'];
            lista.add(opcija);
        }
    }            
    if (ajaxGrupe.readyState == 4 && ajaxGrupe.status == 404)
        console.log("greska");
    }
    ajaxGrupe.open('GET', "http://localhost:3000/v2/grupe", true);
    ajaxGrupe.setRequestHeader("Content-type", "application/json");
    ajaxGrupe.send();
}

function posaljiStudente () {
    let podaci=document.getElementById('studenti').value;
    let grupa=document.getElementById('grupe').value;
        if (podaci!="") {
            let studenti = [];
            let redovi=podaci.split('\n');
            for (let i = 0; i <redovi.length; i++) {
                let poZarezu=redovi[i].split(',');
                let student = {
                    ime: poZarezu[0],
                    index: poZarezu[1],
                    grupa: grupa
                }
                studenti.push(student);
            }
            var ajaxStudent = new XMLHttpRequest();
            ajaxStudent.onreadystatechange = function() {
                if (ajaxStudent.readyState == 4 && ajaxStudent.status == 200) {
                    let text="";
                    let odgovor=JSON.parse(ajaxStudent.responseText);
                    for (let i=0; i<odgovor.length; i++) {
                        text=text+odgovor[i]['message']+'\n';
                    }
                    document.getElementById("studenti").value=text; 
                }
                if (ajaxStudent.readyState == 4 && ajaxStudent.status == 404)
                    console.log("greska");
                }
                ajaxStudent.open('POST', "http://localhost:3000/studenti", true);
                ajaxStudent.setRequestHeader("Content-type", "application/json");
                let jsonStudenti=JSON.stringify(studenti);
                ajaxStudent.send(jsonStudenti);
            }  
}