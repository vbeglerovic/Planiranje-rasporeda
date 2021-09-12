let server = require("../zadatak1i2");
let chai = require("chai");
let chaiHttp = require("chai-http");
var fs = require("fs");

chai.should();
chai.use(chaiHttp);

function izdvojiParametre(red) {
    let pocetak=0;
    let novi=[];
    let unutarViticastih=false;
    let unutarUglastih = false;
    let unutarNavodnika = false;
    for (let i = 0; i < red.length; i++) {
        if (red[i]=='"' && unutarNavodnika==false)
            unutarNavodnika=true;
        else if (red[i]=='"' && unutarNavodnika==true)
            unutarNavodnika=false;
        if (red[i]=='[')
            unutarUglastih=true;
        if (red[i]=='{')
            unutarViticastih=true;
        if (red[i]==']')
            unutarUglastih=false;
        if (red[i]=='}')
            unutarViticastih=false;
        if (red[i]==',' && !unutarViticastih && !unutarUglastih && !unutarNavodnika) {
            novi.push(red.substring(pocetak,i));
            pocetak=i+1;
        }
    }
    novi.push(red.substring(pocetak, red.length));
    return novi;
}

var podaci = fs.readFileSync('test/testniPodaci.txt', { encoding: 'utf-8' });
var redovi = podaci.split('\r\n');


describe("Testiranje: ", () => {
    for (let i = 0; i < redovi.length; i++) {
        let red=izdvojiParametre(redovi[i]);
        //testiranje DELETE
        if (red[0] == "DELETE") {
            it ('DELETE'+red[1], function(done){
                chai.request(server)
                .delete(red[1])
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('message');
                    JSON.stringify(response.body).should.be.eq(red[3].replace(/\\"/g, "\""));
                    done();
                })
            });
        } 
        //testiranje GET
        else if (red[0] == "GET") {
            it ("GET"+red[1], function(done) {
                chai.request(server)
                .get(red[1])
                .end((err, response)=> {
                    response.should.have.status(200);
                    JSON.stringify(response.body).should.be.eq(red[3].replace(/\\"/g, "\""));
                    done();
                });
            });
        }     
        //testiranje POST
        else if (red[0]=="POST") {
            let objekat=red[2].replace(/\\"/g, "\"");
            objekat=JSON.parse(objekat);
            it("POST"+red[1], (done) => {
                chai.request(server)
                .post(red[1])
                .set("Content-Type", "application/json")
                .send(objekat)
                .end((err, response)=> {
                    response.should.have.status(200);
                    response.body.should.have.property('message');
                    JSON.stringify(response.body).should.be.eq(red[3].replace(/\\"/g, "\""));
                    done();
                })
            });
        }
    }
});