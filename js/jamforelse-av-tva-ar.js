addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 och 2022 uppdelade efter kommuner
  (Endast de 25 första av många poster.)
  `);
dbQuery.use('riksdagsval-neo4j');
let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n LIMIT 25');
tableFromData({
  data: electionResults
    // egenskaper/kolumner kommer i lite konstig ordning från Neo - mappa i trevligare ordning
    .map(({ ids, kommun, roster2018, roster2022, parti, labels }) => ({ ids: ids.identity, kommun, roster2018, roster2022, parti, labels }))
});
console.log('electionResults from neo4j', electionResults);

// Hämta valresultat från databasen
let electionRaw = await dbQuery('MATCH (n:Partiresultat) RETURN n LIMIT 500');

// Mappa om data från Neo4j till enklare format
let mappedElectionResults = (electionRaw.rows || electionRaw).map(({ ids, kommun, roster2018, roster2022, parti, labels }) => ({
  ids: ids.identity,
  kommun,
  roster2018,
  roster2022,
  parti,
  labels
}));

// Kommuner vi stödjer
let kommuner = ['Göteborg', 'Malmö', 'Stockholm', 'Umeå', 'Helsingborg', 'Ystad', 'Landskrona', 'Piteå', 'Karlskrona', 'Skellefteå'];

// Skapa dropdown för valår
let selectedYear = addDropdown('Välj år', ['2018', '2022'], '2018');

// Skapa dropdown för kommuner
let selectedKommun = addDropdown('Välj kommun', kommuner, 'Göteborg');

// 🟡 Nu hämtar vi .value direkt
let year = selectedYear.value;
let kommun = selectedKommun.value;

// Lägg till rubrik
addMdToPage(`
  ## Röster per parti (${year} - ${kommun})
`);

// Filtrera resultat baserat på val
let filtered = mappedElectionResults.filter(item => item.kommun === kommun);

// Bygg upp tabell beroende på valt år
let tableData = filtered.map(item => ({
  kommun: item.kommun,
  parti: item.parti,
  röster: year === '2018' ? item.roster2018 : item.roster2022
}));

// Visa tabell
tableFromData({ data: tableData });

// Logga för felsökning
console.log('Alla resultat:', electionResults);
console.log('Valt år:', year);
console.log('Vald kommun:', kommun);
console.log('Filtrerade resultat:', filtered);
