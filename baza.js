const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt2018460', 'root', 'root', {
   host: 'localhost',
   dialect: 'mysql',
   pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
   }
});

const baza={};

baza.Sequelize = Sequelize;  
baza.sequelize = sequelize;

baza.predmet = sequelize.import(__dirname+'/predmet.js');
baza.grupa = sequelize.import(__dirname+'/grupa.js');
baza.aktivnost = sequelize.import(__dirname+'/aktivnost.js');
baza.dan = sequelize.import(__dirname+'/dan.js');
baza.tip = sequelize.import(__dirname+'/tip.js');
baza.student = sequelize.import(__dirname+'/student.js');


//Predmet 1-N Grupa
baza.predmet.hasMany(baza.grupa, {foreignKey: {allowNull: false}});
baza.grupa.belongsTo(baza.predmet);


//Aktivnost N-1 Predmet
baza.predmet.hasMany(baza.aktivnost, {foreignKey: {allowNull: false}});
baza.aktivnost.belongsTo(baza.predmet);

//Aktivnost N-0 Grupa
baza.grupa.hasMany(baza.aktivnost);
baza.aktivnost.belongsTo(baza.grupa); 

//Aktivnost N-1 Dan
baza.dan.hasMany(baza.aktivnost, {foreignKey: {allowNull: false}});
baza.aktivnost.belongsTo(baza.dan);


//Aktivnost N-1 Tip
baza.tip.hasMany(baza.aktivnost, {foreignKey: {allowNull: false}});
baza.aktivnost.belongsTo(baza.tip);

//Student N-M Grupa
baza.studentGrupa=baza.student.belongsToMany(baza.grupa,{as:'grupe',through:'student_grupa',foreignKey:'studentId'});
baza.grupa.belongsToMany(baza.student,{as:'studenti',through:'student_grupa',foreignKey:'grupaId'});

module.exports=baza;