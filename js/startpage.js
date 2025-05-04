import dbInfoOk, { displayDbNotOkText } from "./dbInfoOk.js";

addMdToPage(`
  ## START SIDA!
  * Den här övningen syftar till att arbeta med data från flera olika källor.
`);

if (!dbInfoOk) {
  displayDbNotOkText();
}
else {
  addMdToPage(`
  ### Databaser och collections
  * Nedan data från 4 olika databaser (varav de två sista är olika collections hämtade från MongoDB). Detta är datan vi har tillgång till.
  `);

  addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 och 2022 uppdelade efter kommuner
  (Endast de 20 första av många poster.)
  `);
  dbQuery.use('riksdagsval-neo4j');
  let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n LIMIT 10');
  tableFromData({
    data: electionResults
      // egenskaper/kolumner kommer i lite konstig ordning från Neo - mappa i trevligare ordning
      .map(({ ids, kommun, roster2018, parti, roster2022, labels }) => ({ ids: ids.identity, kommun, roster2018, parti, roster2022, labels }))
  });
  console.log('electionResults from neo4j', electionResults);
};

addMdToPage(`
  ### Info, från SQlite
  Info om våra 21 svenska län, bland annat hur tätbefolkade de är!
  `);
dbQuery.use('counties-sqlite');
let countyInfo = await dbQuery('SELECT * FROM countyInfo LIMIT 10 ');
tableFromData({ data: countyInfo });
console.log('countyInfo', countyInfo);


addMdToPage(`
  ### Geografisk info, från MySQL
  Var alla svenska tätorter finns på kartan. (Endast de 20 första av många poster.)
  `);
dbQuery.use('geo-mysql');
let geoData = await dbQuery('SELECT * FROM geoData  ORDER BY latitude LIMIT 20');
tableFromData({ data: geoData.map(x => ({ ...x, position: JSON.stringify(x.position) })) });
console.log('geoData from mysql', geoData);


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
