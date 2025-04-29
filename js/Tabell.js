addMdToPage(`
  ### Topp 25 kommuner efter medelinkomst (2018 & 2022), från MongoDB
`);
 
dbQuery.use('kommun-info-mongodb');
let income = await dbQuery.collection('incomeByKommun').find({});
 
// Filtrera bort poster som saknar data för både 2018 och 2022
income = income.filter(x => x.medelInkomst2018 && x.medelInkomst2022);
 
// Sortera efter högst medelinkomst 2022
income.sort((a, b) => b.medelInkomst2022 - a.medelInkomst2022);
 
// Begränsa till topp 25
income = income.slice(0, 25);
 
// Visa tabell
tableFromData({
  data: income.map(x => ({
    Kommun: x.kommun,
    'Medelinkomst 2018': x.medelInkomst2018,
    'Medelinkomst 2022': x.medelInkomst2022,
    'Skillnad (kr)': Math.round(x.medelInkomst2022 - x.medelInkomst2018),
    'Skillnad (%)': ((x.medelInkomst2022 - x.medelInkomst2018) / x.medelInkomst2018 * 100).toFixed(1) + '%'
  }))
});
 
addMdToPage(`
  ### Topp 25 kommuner efter medelålder, från MongoDB
`);
 
let ages = await dbQuery.collection('ageByKommun').find({});
 
// Sortera efter högst medelålder
ages.sort((a, b) => b.medelAlder - a.medelAlder);
 
// Begränsa till topp 25
ages = ages.slice(0, 25);
 
// Visa tabell
tableFromData({ data: ages });
 
 