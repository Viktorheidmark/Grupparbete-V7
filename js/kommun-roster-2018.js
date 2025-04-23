// Det här är en del av koden som används för att hämta och visualisera valresultat från riksdagsvalen 2018 och 2022.
addMdToPage(`
  ### Valresultat från riksdagsvalen 2018 uppdelade efter kommuner
  `);
dbQuery.use('riksdagsval-neo4j');
let electionResults = await dbQuery('MATCH (n:Partiresultat) RETURN n ORDER BY n.roster2018 DESC');
tableFromData({
    data: electionResults
        // egenskaper/kolumner kommer i lite konstig ordning från Neo - mappa i trevligare ordning
        .map(({ ids, kommun, roster2018, parti, labels }) => ({ ids: ids.identity, kommun, roster2018, parti, labels }))
});
console.log('electionResults from neo4j', electionResults);

