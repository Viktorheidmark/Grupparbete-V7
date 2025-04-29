
addMdToPage(`
  ### Medel- och medianårsinkomst i tusentals kronor, per kommun, från MongoDB
 
  `);
dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({});
tableFromData({ data: income });
console.log('income from mongodb', income);

addMdToPage(`
  ### Medelålder, per kommun, från MongoDB
 
  `);
dbQuery.use('kommun-info-mongodb');
let ages = await dbQuery.collection('ageByKommun').find({});
tableFromData({ data: ages });
console.log('ages from mongodb', ages);

