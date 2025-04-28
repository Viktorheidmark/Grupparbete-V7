//use("kommun-info");
//db.ageByKommun.find({ kommun: "Järfälla" });

dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({}).limit(100);
console.log('income from mongodb', income);

tableFromData({ data: income })