
addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 och 2022 uppdelade efter kommuner
 
  `);
dbQuery.use('riksdagsval-neo4j');
let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n');
tableFromData({
  data: electionResults
    // egenskaper/kolumner kommer i lite konstig ordning från Neo - mappa i trevligare ordning
    .map(({ ids, kommun, roster2018, roster2022, parti, labels }) => ({ ids: ids.identity, kommun, roster2018, roster2022, parti, labels }))
});
console.log('electionResults from neo4j', electionResults);

