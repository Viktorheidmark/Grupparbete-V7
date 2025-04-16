dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({}).limit(25);
console.log('income from mongodb', income);

tableFromData({ data: income })