// Visa tabeller för kommuner med hög och låg arbetslöshet
addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 och 2022 uppdelade efter kommuner med högst arbetslöshet
`);
dbQuery.use('riksdagsval-neo4j');
let electionResultsHigh = await dbQuery('MATCH (n:Partiresultat) WHERE n.kommun IN ["Flen", "Perstorp", "Malmö", "Eskilstuna", "Fagersta", "Sandviken", "Ronneby", "Filipstad", "Södertälje", "Söderhamn"] RETURN n');
tableFromData({
  data: electionResultsHigh.map(({ ids, kommun, roster2018, parti, roster2022 }) => ({
 
    kommun,
    parti,
    roster2018,
    roster2022,
  }))
});
 
addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 och 2022 uppdelade efter kommuner med lägst arbetslöshet
`);
let electionResultsLow = await dbQuery('MATCH (n:Partiresultat) WHERE n.kommun IN ["Pajala", "Kiruna", "Kungsbacka", "Tjörn", "Öckerö", "Krokom", "Sotenäs", "Gällivare", "Habo", "Mörbylånga"] RETURN n');
tableFromData({
  data: electionResultsLow.map(({ ids, kommun, roster2018, parti, roster2022, labels }) => ({
 
    kommun,
    parti,
    roster2018,
    roster2022,
    parti,
  }))
});